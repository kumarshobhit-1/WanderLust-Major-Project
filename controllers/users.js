const crypto = require('crypto');
const User = require('../models/user');
const PendingUser = require('../models/pendingUser');
const { encrypt, decrypt } = require('../utils/cryptoUtil');
const { sendOtp, sendWelcome, sendPasswordResetEmail, sendPasswordChangedEmail, sendProfileUpdatedEmail, sendAccountDeletedEmail } = require('../utils/mailer');
const axios = require('axios');

module.exports.renderSignupForm = (req, res) => {
    res.render('users/signup', { csrfToken: req.csrfToken() });
};

module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password, confirmPassword } = req.body;
        if (!username || !email || !password || !confirmPassword) {
            req.flash('error', 'All fields are required');
            return res.redirect('/signup');
        }
        if (password !== confirmPassword) {
            req.flash('error', 'Passwords do not match');
            return res.redirect('/signup');
        }

        try {
            const apiKey = process.env.EMAIL_VALIDATION_API_KEY;
            const response = await axios.get(`https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${email}`);
            if (response.data.deliverability === 'UNDELIVERABLE') {
                req.flash('error', 'This email address does not exist. Please enter a valid email!');
                return res.redirect('/signup');
            }
        } catch (apiError) {
            console.error("Email validation API error:", apiError.message);
            req.flash('error', 'Could not verify email at this moment. Please check your API key or try again later.');
            return res.redirect('/signup');
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            req.flash('error', 'Username or email already registered!');
            return res.redirect('/signup');
        }
        
        await PendingUser.deleteMany({ email });
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
        const otpExpires = Date.now() + 10 * 60 * 1000;
        const passwordEncrypted = encrypt(password);

        await PendingUser.create({ username, email, passwordEncrypted, otpHash, otpExpires });
        await sendOtp(email, otp);

        req.flash('success', 'OTP sent to your email. Check inbox/spam.');
        req.flash('emailForOtp', email);
        return res.redirect('/verify-otp');
    } catch (err) {
        return next(err);
    }
};

module.exports.renderVerifyOtp = (req, res) => {
    const email = req.flash('emailForOtp')[0];
    if (!email) {
        req.flash('error', 'Something went wrong. Please sign up again.');
        return res.redirect('/signup');
    }
    res.render('users/verifyOtp', { csrfToken: req.csrfToken(), email });
};

module.exports.verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            req.flash('error', 'Missing parameters');
            return res.redirect('/signup');
        }
        const pending = await PendingUser.findOne({ email });
        if (!pending) {
            req.flash('error', 'No pending signup found. Please signup again.');
            return res.redirect('/signup');
        }
        if (pending.otpExpires.valueOf() < Date.now()) {
            await PendingUser.deleteOne({ _id: pending._id });
            req.flash('error', 'OTP expired. Please signup again.');
            return res.redirect('/signup');
        }

        const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
        if (otpHash !== pending.otpHash) {
            pending.attempts = (pending.attempts || 0) + 1;
            await pending.save();
            if (pending.attempts >= 5) {
                await PendingUser.deleteOne({ _id: pending._id });
                req.flash('error', 'Too many wrong attempts. Please signup again.');
                return res.redirect('/signup');
            }
            req.flash('error', 'Wrong OTP. Please try again.');
            req.flash('emailForOtp', email);
            return res.redirect('/verify-otp');
        }

        const password = decrypt(pending.passwordEncrypted);
        const newUser = new User({ username: pending.username, email: pending.email, isVerified: true });
        const registeredUser = await User.register(newUser, password);
        await PendingUser.deleteOne({ _id: pending._id });
        await sendWelcome(registeredUser.email, registeredUser.username);

        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash('success', `Welcome to Wanderlust, ${registeredUser.username}!`);
            return res.redirect('/listings');
        });
    } catch (err) {
        return next(err);
    }
};

module.exports.resendOtp = async (req, res, next) => {
    try {
        const { email } = req.body;
        const pending = await PendingUser.findOne({ email });
        if (!pending) {
            req.flash('error', 'No pending signup found. Please signup again!');
            return res.redirect('/signup');
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        pending.otpHash = crypto.createHash('sha256').update(otp).digest('hex');
        pending.otpExpires = Date.now() + 10 * 60 * 1000;
        pending.attempts = 0;
        await pending.save();
        await sendOtp(email, otp);
        
        req.flash('success', 'A new OTP has been sent');
        req.flash('emailForOtp', email);
        return res.redirect('/verify-otp');
    } catch (err) {
        return next(err);
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login', { csrfToken: req.csrfToken() });
};

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back to Wanderlust!');
    const redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash('success', 'You are logged out!');
        res.redirect('/listings');
    });
};

module.exports.renderForgotPasswordForm = (req, res) => {
    res.render("users/forgot-password", { csrfToken: req.csrfToken() });
};

module.exports.handleForgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        req.flash("error", "No account with that email address exists.");
        return res.redirect("/forgot-password");
    }
    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    await sendPasswordResetEmail(user.email, user.username, token);
    req.flash("success", `An e-mail has been sent to ${user.email} with further instructions.`);
    res.redirect("/login");
};

module.exports.renderResetPasswordForm = async (req, res) => {
    const { token } = req.params;
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) {
        req.flash("error", "Password reset token is invalid or has expired.");
        return res.redirect("/forgot-password");
    }
    res.render("users/reset-password", { csrfToken: req.csrfToken(), token: token, username: user.username });
};

module.exports.handleResetPassword = async (req, res, next) => {
    const { token, password, confirmPassword } = req.body;
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

    if (!user) {
        req.flash("error", "Password reset token is invalid or has expired.");
        return res.redirect("/forgot-password");
    }
    if (password !== confirmPassword) {
        req.flash("error", "Passwords do not match.");
        return res.redirect(`/reset-password/${token}`);
    }

    await user.setPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    await sendPasswordChangedEmail(user.email, user.username);

    req.login(user, (err) => {
        if (err) { return next(err); }
        req.flash("success", "Success! Your password has been changed.");
        res.redirect("/listings");
    });
};


module.exports.renderSettingsPage = (req, res) => {
    res.render("users/settings", { csrfToken: req.csrfToken() });
};


module.exports.updateProfile = async (req, res, next) => { 
    try {
        const { username } = req.body;
        const user = await User.findById(req.user._id);

        if (username && username !== user.username) {
            const existingUser = await User.findOne({ username: username });
            if (existingUser) {
                req.flash("error", "That username is already taken.");
                return res.redirect("/settings");
            }
            user.username = username;
        }

        await user.save();
        
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }

            sendProfileUpdatedEmail(user.email, user.username);
            req.flash("success", "Your profile has been updated successfully.");
            res.redirect("/settings");
        });

    } catch (err) {
        next(err);
    }
};


module.exports.updatePassword = async (req, res, next) => { 
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        
        if (!newPassword || newPassword !== confirmPassword) {
            req.flash("error", "New passwords do not match or are empty.");
            return res.redirect("/settings");
        }

        const user = await User.findById(req.user._id);

        await user.changePassword(currentPassword, newPassword);
        
        await user.save();
        await sendPasswordChangedEmail(user.email, user.username);
        
        req.flash("success", "Your password has been changed successfully.");
        res.redirect("/settings");

    } catch (err) {
        req.flash("error", "Incorrect current password. Please try again.");
        return res.redirect("/settings");
    }
};

module.exports.deleteAccount = async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);

    await User.findByIdAndDelete(userId);

    await sendAccountDeletedEmail(user.email, user.username);
    
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "Your account has been permanently deleted.");
        res.redirect("/listings");
    });
};

module.exports.renderDashboard = (req, res) => {
    res.render('users/dashboard', { user: req.user });
};

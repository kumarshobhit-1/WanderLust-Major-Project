const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const userController = require("../controllers/users.js");
const csurf = require("csurf"); // <-- Yeh line add karein

const csrfProtection = csurf({ cookie: true }); // <-- Yeh line add karein

router
.route("/signup")
.get(csrfProtection, userController.renderSignupForm)
.post(csrfProtection,wrapAsync(userController.signup));


router.get('/verify-otp', csrfProtection, userController.renderVerifyOtp);
router.post('/verify-otp',csrfProtection, wrapAsync(userController.verifyOtp));
router.post('/resend-otp', csrfProtection, wrapAsync(userController.resendOtp));


router
.route("/login")
.get(csrfProtection,userController.renderLoginForm)
.post(
    csrfProtection,
    saveRedirectUrl,
    passport.authenticate("local", { 
        failureRedirect : '/login', 
        failureFlash : true
    }), 
    userController.login
);


router.get("/my-listings", isLoggedIn, async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user._id });
    res.render("users/myListings", { listings });
  } catch (err) {
    console.error(err);
    req.flash("error", "Unable to fetch your listings!");
    res.redirect("/dashboard");
  }
});

router.get("/forgot-password", csrfProtection, userController.renderForgotPasswordForm);
router.post("/forgot-password", csrfProtection, wrapAsync(userController.handleForgotPassword));
router.get("/reset-password/:token", csrfProtection, wrapAsync(userController.renderResetPasswordForm));
router.post("/reset-password", csrfProtection, wrapAsync(userController.handleResetPassword));

// Render the main settings page
router.get("/settings", isLoggedIn, csrfProtection, userController.renderSettingsPage);

// Handle profile updates (username)
router.post("/settings/update-profile", isLoggedIn, csrfProtection, wrapAsync(userController.updateProfile));

// Handle password updates
router.post("/settings/update-password", isLoggedIn, csrfProtection, wrapAsync(userController.updatePassword));

// Handle account deletion
router.post("/settings/delete-account", isLoggedIn, csrfProtection, wrapAsync(userController.deleteAccount));


router.get("/logout", userController.logout); 

router.get("/dashboard", isLoggedIn, userController.renderDashboard);




module.exports = router;
                                                           

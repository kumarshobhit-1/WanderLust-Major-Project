const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const createEmailTemplate = (options) => {
    const { preheader, headline, body, buttonLink, buttonText } = options;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; }
          .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
          .header { background-color: #ff5a5f; padding: 40px; text-align: center; color: white; }
          .header h1 { margin: 0; font-size: 28px; letter-spacing: 1px; }
          .content { padding: 40px; line-height: 1.7; color: #555555; font-size: 16px; }
          .content h2 { color: #333333; margin-top: 0; }
          .content p { margin: 0 0 20px; }
          .button-container { text-align: center; margin: 30px 0; }
          .button { display: inline-block; padding: 14px 28px; font-size: 16px; color: #ffffff; background-color: #ff5a5f; text-decoration: none; border-radius: 5px; font-weight: bold; }
          .footer { background-color: #f4f4f4; padding: 30px; text-align: center; color: #aaaaaa; font-size: 12px; }
          .footer a { color: #ff5a5f; text-decoration: none; }
        </style>
      </head>
      <body>
        <span style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</span>
        <table role="presentation" class="container" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr><td style="padding: 20px 0;">
            <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);" border="0" cellpadding="0" cellspacing="0">
              <tr><td class="header"><h1>Wanderlust</h1></td></tr>
              <tr><td class="content">
                <h2>${headline}</h2>
                ${body}
                ${buttonLink && buttonText ? `<div class="button-container"><a href="${buttonLink}" class="button">${buttonText}</a></div>` : ''}
              </td></tr>
              <tr><td class="footer">
                <p>&copy; ${new Date().getFullYear()} Wanderlust. All rights reserved.</p>
                <p><a href="#">Unsubscribe</a> | <a href="http://localhost:8080/privacy">Privacy Policy</a></p>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `;
};


const sendOtp = async (to, otp) => {
    const html = createEmailTemplate({
        preheader: `Your verification code is ${otp}`,
        headline: 'Your Verification Code',
        body: `<p>Hello,</p><p>Your Wanderlust verification OTP is: <strong>${otp}</strong></p><p>This code expires in 10 minutes.</p>`
    });
    return transporter.sendMail({ from: `"Wanderlust" <${process.env.EMAIL_USER}>`, to, subject: 'Verify your email (OTP)', html });
};

const sendWelcome = async (to, username) => {
    const html = createEmailTemplate({
        preheader: 'Welcome to the Wanderlust community!',
        headline: `Welcome, ${username}!`,
        body: '<p>Thanks for joining Wanderlust. We are excited to have you on board. Start exploring amazing places now!</p>',
        buttonLink: 'http://localhost:8080/listings',
        buttonText: 'Explore Listings'
    });
    return transporter.sendMail({ from: `"Wanderlust" <${process.env.EMAIL_USER}>`, to, subject: 'Welcome to Wanderlust!', html });
};

const sendListingCreatedEmail = async (userEmail, username, listing) => {
    const html = createEmailTemplate({
        preheader: `Your new listing, "${listing.title}", is live!`,
        headline: 'Listing Created Successfully!',
        body: `<p>Hello ${username},</p><p>Congratulations! Your new listing, "<b>${listing.title}</b>", has been successfully created on Wanderlust.</p>`,
        buttonLink: `http://localhost:8080/listings/${listing._id}`,
        buttonText: 'View Your Listing'
    });
    return transporter.sendMail({ from: `"Wanderlust" <${process.env.EMAIL_USER}>`, to: userEmail, subject: '✔ Your Listing is Live!', html });
};

const sendListingUpdatedEmail = async (userEmail, username, listing) => {
    const html = createEmailTemplate({
        preheader: `Your listing, "${listing.title}", has been updated.`,
        headline: 'Listing Updated!',
        body: `<p>Hello ${username},</p><p>Your listing, "<b>${listing.title}</b>", has been successfully updated.</p>`,
        buttonLink: `http://localhost:8080/listings/${listing._id}`,
        buttonText: 'View Changes'
    });
    return transporter.sendMail({ from: `"Wanderlust" <${process.env.EMAIL_USER}>`, to: userEmail, subject: '✔ Your Listing has been Updated', html });
};

const sendListingDeletedEmail = async (userEmail, username, listingTitle) => {
    const html = createEmailTemplate({
        preheader: `Your listing, "${listingTitle}", has been deleted.`,
        headline: 'Listing Deleted',
        body: `<p>Hello ${username},</p><p>This is a confirmation that your listing, "<b>${listingTitle}</b>", has been successfully deleted from Wanderlust.</p><p>If you did not perform this action, please contact our support team immediately at webapp.wanderlust@gmail.com.</p>`
    });
    return transporter.sendMail({ from: `"Wanderlust" <${process.env.EMAIL_USER}>`, to: userEmail, subject: '❗ Your Listing has been Deleted', html });
};

const sendPasswordResetEmail = async (email, username, token) => {
    const html = createEmailTemplate({
        preheader: 'Reset your password for Wanderlust.',
        headline: 'Password Reset Request',
        body: `<p>Hello ${username},</p><p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p><p>If you did not request this, please ignore this email.</p>`,
        buttonLink: `http://localhost:8080/reset-password/${token}`,
        buttonText: 'Reset Your Password'
    });
    return transporter.sendMail({ from: `"Wanderlust" <${process.env.EMAIL_USER}>`, to: email, subject: 'Wanderlust - Password Reset', html });
};

const sendPasswordChangedEmail = async (email, username) => {
    const html = createEmailTemplate({
        preheader: 'Your password has been successfully changed.',
        headline: 'Password Changed Successfully!',
        body: `<p>Hello ${username},</p><p>This is a confirmation that the password for your account associated with ${email} has just been changed.</p>`
    });
    return transporter.sendMail({ from: `"Wanderlust" <${process.env.EMAIL_USER}>`, to: email, subject: '✔ Your Password has been Changed', html });
};

const sendProfileUpdatedEmail = async (email, username) => {
    const html = createEmailTemplate({
        preheader: 'Your Wanderlust profile details have been updated.',
        headline: 'Profile Updated Successfully!',
        body: `<p>Hello ${username},</p><p>This is a confirmation that your account details have been recently updated.</p><p>If you did not make this change, please contact our support team immediately.</p>`,
        buttonLink: `http://localhost:8080/dashboard`,
        buttonText: 'View Your Profile'
    });
    return transporter.sendMail({ from: `"Wanderlust" <${process.env.EMAIL_USER}>`, to: email, subject: '✔ Your Wanderlust Profile has been Updated', html });
};

const sendAccountDeletedEmail = async (email, username) => {
    const html = createEmailTemplate({
        preheader: 'Your Wanderlust account has been permanently deleted.',
        headline: 'Account Deleted',
        body: `<p>Hello ${username},</p><p>This is a confirmation that your Wanderlust account associated with ${email} has been permanently deleted.</p><p>We're sorry to see you go. If this was a mistake, please contact our support team.</p>`
    });
    return transporter.sendMail({ from: `"Wanderlust" <${process.env.EMAIL_USER}>`, to: email, subject: '❗ Your Wanderlust Account has been Deleted', html });
};


module.exports = {
    sendOtp,
    sendWelcome,
    sendListingCreatedEmail,
    sendListingUpdatedEmail,
    sendListingDeletedEmail,
    sendPasswordResetEmail,
    sendPasswordChangedEmail,
    sendProfileUpdatedEmail,
    sendAccountDeletedEmail,
};

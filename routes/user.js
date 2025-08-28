const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const userController = require("../controllers/users.js");


router
.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));


router
.route("/login")
.get(userController.renderLoginForm)
.post(
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

router.get("/logout", userController.logout); 

router.get("/dashboard", isLoggedIn, userController.renderDashboard);


module.exports = router;
                                                           

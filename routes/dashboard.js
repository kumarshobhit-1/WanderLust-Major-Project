const express = require("express");
const router = express.Router();

// Dashboard page
router.get("/", (req, res) => {
    // Agar user login nahi hai to redirect
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.redirect("/login");
    }
    res.render("dashboard", { user: req.user });
});

module.exports = router;

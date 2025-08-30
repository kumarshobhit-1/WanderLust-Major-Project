const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.redirect("/login");
    }
    res.render("dashboard", { user: req.user });
});

module.exports = router;

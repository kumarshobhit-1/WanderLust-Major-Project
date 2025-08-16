const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListings } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const Listing = require("../models/listing");

// ✅ Search route sabse upar rakho (/:id se pehle)
router.get("/search", async (req, res) => {
  const { location } = req.query;

  if (!location || location.trim() === "") {
    req.flash("error", "Please enter a location to search.");
    return res.redirect("/listings");
  }

  try {
    const listings = await Listing.find({
      location: { $regex: new RegExp(location, "i") } // case-insensitive search
    });

    if (listings.length === 0) {
      req.flash("error", "No listings found for this location.");
      return res.redirect("/listings");
    }

    res.render("listings/index", { allListings: listings });
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong. Please try again.");
    res.redirect("/listings");
  }
});

router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,  upload.single('listing[image]'), validateListings, wrapAsync(listingController.createListing));


// new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListings, wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));



// Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));


module.exports = router;


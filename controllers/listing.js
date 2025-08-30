const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken : mapToken });
const { sendListingCreatedEmail, sendListingUpdatedEmail, sendListingDeletedEmail } = require('../utils/mailer'); // <-- Add this


module.exports.index = async (req, res) =>{
   const allListings = await Listing.find({});
   res.render("listings/index.ejs", {allListings})
};

module.exports.renderNewForm = (req, res) =>{
    res.render("listings/new.ejs", { csrfToken: req.csrfToken() });
};

// controllers/listing.js

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");

    // ✅ YEH CHECK ADD KAREIN
    if (!listing) {
        req.flash("error", "The listing you requested does not exist!");
        return res.redirect("/listings");
    }

    // Yahan hum check kar rahe hain ki agar owner null hai
    if (!listing.owner) {
        req.flash("error", "This listing has an invalid owner and cannot be displayed. It may be deleted soon.");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", {listing,  mapToken: process.env.MAP_TOKEN, csrfToken: req.csrfToken()  });
};


module.exports.createListing = async (req, res, next) =>{
    let response = await geocodingClient.forwardGeocode({
        query : req.body.listing.location,
        limit : 1,
    })
    .send();

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};

    newListing.geometry = response.body.features[0].geometry;

    await newListing.save();

    await sendListingCreatedEmail(req.user.email, req.user.username, newListing);

    req.flash("success", "New Listing Created! ");
    res.redirect("/listings");
};

module.exports.editListing = async (req, res) =>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    let originalImage = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs" , { listing, originalImage,  csrfToken: req.csrfToken()  });
};

module.exports.updateListing = async (req, res) =>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    await sendListingUpdatedEmail(req.user.email, req.user.username, listing);

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;

    const deletedListing = await Listing.findById(id);
    if (!deletedListing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    const listingTitle = deletedListing.title; 

    await Listing.findByIdAndDelete(id);

    await sendListingDeletedEmail(req.user.email, req.user.username, listingTitle);

    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};

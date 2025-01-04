const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudconfig.js");
const upload = multer({storage});

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single("listing[image]"),validateListing, wrapAsync(listingController.addNew));


// Add New Listing
router.get("/new", isLoggedIn, listingController.renderNew);


router.route("/:id")
    .get(wrapAsync(listingController.renderlisting))
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateEdit))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroylisting));



// Edit Listing
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEdit));


module.exports = router;

const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { validatereview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const ReviewController = require("../controllers/reviews.js");


// Reviews
// Post Review Route
router.post("/", 
    isLoggedIn,
    validatereview, 
    wrapAsync(ReviewController.postReview)
);

// Delete Review Route
router.delete("/:reviewId", 
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(ReviewController.destroyReview)
);

module.exports = router;
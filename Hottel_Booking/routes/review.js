const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require("../Utils/ExpressError.js");
const WrapAsync = require("../Utils/WrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview,isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js")
// Reviews
//  Post  Review Route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  WrapAsync(reviewController.createReview)
);

//  Delete Review Route


router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  WrapAsync(reviewController.destroyReview)
);

module.exports = router;

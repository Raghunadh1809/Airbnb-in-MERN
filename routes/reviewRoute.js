const express = require("express");
const router = express.Router({ mergeParams: true }); // Preserve the req.params values from the parent router. If the parent and the child have conflicting param names, the child’s value take precedenc
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const asyncWrap = require("../utils/wrapAsync.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");

const reviewContoller = require("../controller/reviews.js");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  asyncWrap(reviewContoller.createReview)
);

// Delete Review Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  asyncWrap(reviewContoller.destoryReview)
);

module.exports = router;

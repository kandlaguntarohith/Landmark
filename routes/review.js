const express = require("express");
const router = express.Router({ mergeParams: true });
const catchError = require("../utils/catch-error");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

const review = require("../controller/review");

router.post("/", isLoggedIn, validateReview, catchError(review.postReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchError(review.deleteReview)
);
module.exports = router;

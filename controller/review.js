const Landmark = require("../models/landmark");
const Review = require("../models/review");

module.exports.postReview = async (req, res, next) => {
  const landmark = await Landmark.findById(req.params.id);
  if (!landmark) {
    req.flash("error", "landmark not found !!");
    res.redirect("/landmarks");
  }
  const review = new Review(req.body.review);
  review.author = req.user._id;
  landmark.reviews.push(review);
  await review.save();
  await landmark.save();
  req.flash("success", "Successfully posted review !");
  res.redirect(`/landmarks/${landmark._id}`);
};

module.exports.deleteReview = async (req, res, next) => {
  const { id, reviewId } = req.params;
  await Landmark.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted review !");
  res.redirect(`/landmarks/${id}`);
};

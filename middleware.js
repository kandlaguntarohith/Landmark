const Landmark = require("./models/landmark");
const ExpressError = require("./utils/express-error");
const { reviewSchema } = require("./joi-shemas");
const { landmarkSchema } = require("./joi-shemas");
const Review = require("./models/review");
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You Must be Signed in");
    // req.session.returnTo = req.originalUrl;
    return res.redirect("/login");
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const landmark = await Landmark.findById(id);
  if (!landmark.author.equals(req.user._id)) {
    req.flash("error", "You are not authorized to that !");
    return res.redirect("/landmarks");
  }
  next();
};
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You are not authorized to that !");
    return res.redirect(`/landmarks/${id}`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const result = reviewSchema.validate(req.body);
  if (result.error) {
    const msg = result.error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validatelandmark = (req, res, next) => {
  // console.log(req.body);
  const result = landmarkSchema.validate(req.body);
  if (result.error) {
    const msg = result.error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

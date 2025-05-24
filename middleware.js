const CampGround = require("./Models/CampGrounds");

const Review = require("./Models/review");

const {
  campgroundSchema,
  reviewSchema,
} = require("./Validations/validateschemas");

const expressError = require("./utils/ExpressError");

const isLoggedIn = (req, res, next) => {
  req.session.returnTo = req.originalUrl;
  if (req.isAuthenticated()) return next();
  req.flash("error", "You must be logged in first!!!");
  res.redirect("/login");
};

const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const camp = await CampGround.findById(id);
  if (camp.author.equals(req.user._id)) return next();
  req.flash(
    "error",
    `You don't have permission to modify or delete ${camp.title}`
  );
  res.redirect(`/campground/${id}`);
};

const validateCampGround = (req, res, next) => {
  const { error: campError } = campgroundSchema.validate(req.body);
  if (campError) {
    console.log(campError);
    const errmessage = campError.details.map((el) => el.message).join(", ");
    throw new expressError(`${errmessage}`, 500);
  } else next();
};

const validateReview = (req, res, next) => {
  const { error: reviewError } = reviewSchema.validate(req.body);
  if (reviewError) {
    const errmessage = reviewError.details.map((el) => el.message).join(", ");
    throw new expressError(`${errmessage}`, 500);
  } else next();
};

const isReviewAuthor = async (req, res, next) => {
  const { reviewID, id } = req.params;
  const camp = await CampGround.findById(id).populate("author");
  const review = await Review.findById(reviewID).populate("author");
  if (review.author.equals(req.user._id) || camp.author.equals(req.user._id))
    return next();
  req.flash(
    "error",
    `You don't have permission to modify or delete review made by ${review.author.username}`
  );
  res.redirect(`/campground/${id}`);
};

const isReview = async (req, res, next) => {
  const { reviewID, id } = req.params;
  const camp = await CampGround.findById(id).populate("reviews");
  for (review of camp.reviews) {
    if (review.author._id.equals(req.user._id)) {
      req.flash("error", `Can't make multiple reviews`);
      return res.redirect(`/campground/${id}`);
    }
  }
  next();
};

module.exports.isAuthor = isAuthor;
module.exports.isLoggedIn = isLoggedIn;
module.exports.validateCampGround = validateCampGround;
module.exports.validateReview = validateReview;
module.exports.isReviewAuthor = isReviewAuthor;
module.exports.isReview = isReview;

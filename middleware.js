// This method works by checking if the req.user object (set by Passport during authentication) is present. If req.user exists, the user is considered authenticated.
const Listing = require("./models/listing");
const Review = require("./models/reviews.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingschema, reviewSchema } = require("./schema.js"); // joi validation schmea

// Middleware to check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  // console.log("Session Object:", req.session); // Log the session object for debugging

  if (!req.isAuthenticated()) {
    // checks if req.user exists.
    req.session.redirectUrl = req.originalUrl; // Save original URL to session
    // console.log("Redirect URL saved in session:", req.session.redirectUrl); // Debug log
    req.flash("error", "You must be logged in to do that"); // Flash message
    return res.redirect("/login"); // Redirect to login page
  }

  next(); // User is authenticated, proceed
};

// Middleware to save redirect URL into res.locals
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl; // Save to res.locals
    // console.log("Redirect URL in res.locals:", res.locals.redirectUrl); // Debug log
  }

  next(); // Proceed to next middleware
};

// different user do not edit listing // in listingRoute in app.put , edit , delete
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// joi validation schmea
module.exports.validateListing = (req, res, next) => {
  const { error } = listingschema.validate(req.body);
  if (error) {
    console.log(error);
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, `Validation in Joi Schema , ${errMsg}`);
  } else {
    next();
  }
};

// Reviews
// Post Route

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, `Validation in Joi Schema , ${errMsg}`);
  } else {
    next();
  }
};

// different user do not edit reivew // in listingRoute in app.put , edit , delete
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  console.log(`Review ID: ${reviewId}`);
  let review = await Review.findById(reviewId);
  console.log(review);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

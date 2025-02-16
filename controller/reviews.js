const Listing = require("../models/listing");
const Review = require("../models/reviews");

module.exports.createReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const newreview = new Review(req.body.review);
  newreview.author = req.user._id;
  console.log(newreview);
  listing.reviews.push(newreview);

  await listing.save();
  await newreview.save();
  req.flash("success", "New Review Created");
  res.redirect(`/listings/${req.params.id}`);
};

module.exports.destoryReview = async (req, res) => {
  let { id, reviewId } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  }); // Remove review reference from the listing
  await Review.findByIdAndDelete(reviewId); // Delete the actual review document
  console.log(listing);
  req.flash("success", "Review Deleted");
  res.redirect(`/listings/${id}`);
};

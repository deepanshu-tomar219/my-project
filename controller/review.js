const Review = require("../models/review.js");
const Listing = require("../models/listings.js");

module.exports.addNewReview = async (req, res) => {

  let listing = await Listing.findById(req.params.id);

  let id = req.params.id;

  let newReview = new Review(req.body.review);

  listing.reviews.push(newReview);

  newReview.author = req.user._id;

  await newReview.save();
  await listing.save();

  req.flash("success", "Review Added Successfully!");


  res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res) => {

  let {id, reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  let deletedReview = await Review.findByIdAndDelete(reviewId);

  if (!deletedReview) {

    throw new ExpressError(404, "Please Enter Valid Data or id");
  }

  req.flash("success", "Review Deleted Successfully!");

  res.redirect(`/listings/${id}`);
};
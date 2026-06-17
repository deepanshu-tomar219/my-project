const express = require("express");
const router = express.Router({ mergeParams: true });
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listings.js");
const Review = require("../models/review.js");
const {isLoggedIn, isListingOwner, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controller/review.js");

const checkValidation = (req, res, next) => {

  let result = reviewSchema.validate(req.body);


  console.log(result);

  if (result.error) {


    console.log("this is me");

    let errorMsg = result.error.details.map((e) => e.message).join(",");
    throw new ExpressError(400, errorMsg);
  } else {

    next();
  }
};


router.post("/", isLoggedIn,checkValidation, wrapAsync(reviewController.addNewReview));

router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;
const express = require("express");
const router = express.Router();
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listings.js");
const {isLoggedIn, isListingOwner} = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});



const checkValidation = (req, res, next) => {

  let result = listingSchema.validate(req.body);


  console.log(result);

  if (result.error) {

    let errorMsg = result.error.details.map((e) => e.message).join(",");
    throw new ExpressError(400, errorMsg);
  } else {

    next();
  }
};

router.get("/", wrapAsync(listingController.renderListings));

router.get("/new",isLoggedIn, wrapAsync(listingController.newListing));


router.post("/",isLoggedIn,upload.single('image'), checkValidation, wrapAsync(listingController.addNewListing));

router.get("/:id/edit",isLoggedIn,isListingOwner, wrapAsync(listingController.renderEditForm));

router.get("/:id",isLoggedIn, wrapAsync(listingController.showListing));

router.put("/:id",isLoggedIn,isListingOwner,upload.single('image'), checkValidation, wrapAsync(listingController.updateListing));

router.delete("/:id",isLoggedIn,isListingOwner, wrapAsync(listingController.deleteListing));

module.exports = router;
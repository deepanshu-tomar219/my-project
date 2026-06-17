const joi = require("joi");

const listingSchema = joi.object({

      _method : joi.string(),
      title : joi.string().required(),
      description: joi.string().required(),
      price : joi.number().min(0).required(),
      country : joi.string().required(),
      location: joi.string().required(),


}).required();

const reviewSchema = joi.object({
  review: joi.object({
    comment: joi.string().required(),
    rating: joi.number().required().min(1).max(5)
  }).required()
}).required();

module.exports = {listingSchema, reviewSchema };
const Listing = require("./models/listings.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) =>{

        if(!req.isAuthenticated()){

        req.session.redirectUrl = req.originalUrl;
       
        req.flash("error", "User must be logged in");

        return res.redirect("/users/login");
        }

        next();
};

module.exports.saveOriginalUrl = (req, res, next)=>{

          if(req.session.redirectUrl){

                res.locals.redirectUrl = req.session.redirectUrl;
          }

          next();
};

module.exports.isListingOwner = async(req, res, next) =>{

        let { id } = req.params;

        const listing = await Listing.findById(id);

        if(!listing.owner._id.equals(res.locals.curUser._id)){

            req.flash("error", "you don't have permission");
            return res.redirect(`/listings/${id}`);
        }

        next();
};

module.exports.isReviewAuthor = async(req, res, next) =>{

        let { reviewId } = req.params;

        const review = await Review.findById(reviewId);

        if(!review.author._id.equals(res.locals.curUser._id)){

            req.flash("error", "you don't have permission");
            return res.redirect(`/listings/${id}`);
        }

        next();
};
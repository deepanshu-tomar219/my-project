// const Listing = require("../models/listings.js");
// const axios = require("axios");

// module.exports.renderListings = async (req, res) => {

//   const allListings = await Listing.find({});

//   res.render("listings/index", { allListings });

// };

// module.exports.newListing = async (req, res) => {

     
//         res.render("listings/new");
// };

// module.exports.showListing = async (req, res) => {

//   let { id } = req.params;
//   let listing = await Listing.findById(id).populate({path : "reviews" , populate : {path : "author"},}).populate("owner");

//   if (!listing) {
//     //throw new ExpressError(404, "Listing not found");
//     req.flash("error", "Listing You Requested For Does Not Exist");
//     return res.redirect("/listings");
//   }

//   res.render("listings/show", { listing });
// };

// module.exports.addNewListing = async (req, res) => {




//   //let defaultImage = "https://unsplash.com/photos/group-of-people-gathered-by-a-rustic-wooden-fence-DJHq_RAw5bo"

//   let { title, description, price, country, location } = req.body;

//   let imageUrl = "";
//   let imageFileName = "";

//   if(req.file){

//       imageUrl = req.file.path;
//       imageFileName = req.file.filename;
//   }

//   let newListing = new Listing({
//     title,
//     description,
//     image: {
//       url: imageUrl,
//       filename: imageFileName,
//     },
//     price,
//     country,
//     location,
//   });

//   newListing.owner = req.user._id;

//   const response = await axios.get(
//   `https://nominatim.openstreetmap.org/search`,
//   {
//     params: {
//       q: location,
//       format: "json",
//       limit: 1,
//       "accept-language": "en"
//     },
//     headers: {
//       "User-Agent": "WanderLustApp/1.0"
//     }
//   }
// );
//     if (response.data.length > 0) {

//         const place = response.data[0];

//         newListing.geometry = {
//             type: "Point",
//             coordinates: [
//                 parseFloat(place.lon),
//                 parseFloat(place.lat)
//             ]
//         };
//   }

//   await newListing.save();

//   req.flash("success", "New Listing Added Successfully!");

//   res.redirect("/listings");
// };

// module.exports.renderEditForm = async (req, res) => {

//   let { id } = req.params;

//   let listing = await Listing.findById(id);

//   if (!listing) {

//     //throw new ExpressError(404, "Listing not found");
//     req.flash("error", "Listing You Requested For Does Not Exist");
//     return res.redirect("/listings");

//   }

//   res.render("listings/edit", { listing });
// };

// module.exports.updateListing = async (req, res) => {

//   //   if (!req.body.price || !req.body.title) {
//   //   throw new ExpressError(400,"Please Enter Valid Data for Listing");
//   // }

//   //try {
//   const { id } = req.params;

 
//   let curListing = await Listing.findById(id);

//   const { title, description, price, country, location } = req.body;

//   let imageUrl = curListing.image.url;
//   let imageFileName = curListing.image.filename;

//   if(req.file){

//       imageUrl = req.file.path;
//       imageFileName = req.file.filename;
//   }

//   const updatedListing = {
//     title,
//     description,
//     image : {
//        url : imageUrl,
//        filename : imageFileName,
//     },
//     price,
//     country,
//     location,
//   };

//   const listing = await Listing.findByIdAndUpdate(id, updatedListing, {
//     runValidators: true,
//     new: true,
//   });

//   if (!listing) {

//     //throw new ExpressError(404, "Listing not Found");
//     req.flash("error", "Listing You Requested For Does Not Exist");
//     return res.redirect("/listings");
//   }

//   const response = await axios.get(
//   `https://nominatim.openstreetmap.org/search`,
//   {
//     params: {
//       q: listing.location,
//       format: "json",
//       limit: 1,
//       "accept-language": "en"
//     },
//     headers: {
//       "User-Agent": "WanderLustApp/1.0"
//     }
//   }
// );
//     if (response.data.length > 0) {

//         const place = response.data[0];

//         listing.geometry = {
//             type: "Point",
//             coordinates: [
//                 parseFloat(place.lon),
//                 parseFloat(place.lat)
//             ]
//         };
//   }

//   await listing.save();

  

//   req.flash("success", "Listing Updated Successfully!");


//   res.redirect(`/listings/${id}`);
//   //} catch (err) {
//   //console.log(err);
//   //res.status(500).send("Update failed");
//   //}
// };

// module.exports.deleteListing = async (req, res) => {

//   let { id } = req.params;

//   let deletedListing = await Listing.findByIdAndDelete(id);

//   if (!deletedListing) {

//     //throw new ExpressError(404, "Please Enter Valid Data or id");
//     req.flash("error", "Listing You Requested For Does Not Exist");
//     return res.redirect("/listings");
//   }

//   console.log(deletedListing);

//   req.flash("success", "Listing Deleted Successfully!");


//   res.redirect("/listings");
// };

const Listing = require("../models/listings.js");
const axios = require("axios");

// GET all listings
module.exports.renderListings = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

// GET new listing form
module.exports.newListing = async (req, res) => {
  res.render("listings/new");
};

// SHOW single listing
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing You Requested For Does Not Exist");
    return res.redirect("/listings");
  }

  res.render("listings/show", { listing });
};

// CREATE listing
module.exports.addNewListing = async (req, res) => {
  const { title, description, price, country, location } = req.body;

  let imageUrl = "";
  let imageFileName = "";

  if (req.file) {
    imageUrl = req.file.path;
    imageFileName = req.file.filename;
  }

  const newListing = new Listing({
    title,
    description,
    price,
    country,
    location,
    image: {
      url: imageUrl,
      filename: imageFileName,
    },
    owner: req.user._id,
  });

  // 🌍 Geocoding (OpenStreetMap Nominatim)
  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: newListing.location,
          format: "json",
          limit: 1,
          "accept-language": "en",
        },
        headers: {
          "User-Agent": "WanderLustApp/1.0",
        },
      }
    );

    if (response.data.length > 0) {
      const place = response.data[0];

      newListing.geometry = {
        type: "Point",
        coordinates: [
          parseFloat(place.lon),
          parseFloat(place.lat),
        ],
      };
    }
  } catch (err) {
    console.log("Geocoding failed:", err.message);
  }

  await newListing.save();

  req.flash("success", "New Listing Added Successfully!");
  res.redirect("/listings");
};

// GET edit form
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing You Requested For Does Not Exist");
    return res.redirect("/listings");
  }

  res.render("listings/edit", { listing });
};

// UPDATE listing
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, country, location } = req.body;

  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing You Requested For Does Not Exist");
    return res.redirect("/listings");
  }

  // update basic fields
  listing.title = title;
  listing.description = description;
  listing.price = price;
  listing.country = country;
  listing.location = location;

  // update image if new file uploaded
  if (req.file) {
    listing.image.url = req.file.path;
    listing.image.filename = req.file.filename;
  }

  // 🌍 re-geocode location
  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: listing.location,
          format: "json",
          limit: 1,
          "accept-language": "en",
        },
        headers: {
          "User-Agent": "WanderLustApp/1.0",
        },
      }
    );

    if (response.data.length > 0) {
      const place = response.data[0];

      listing.geometry = {
        type: "Point",
        coordinates: [
          parseFloat(place.lon),
          parseFloat(place.lat),
        ],
      };
    }
  } catch (err) {
    console.log("Geocoding failed:", err.message);
  }

  await listing.save();

  req.flash("success", "Listing Updated Successfully!");
  res.redirect(`/listings/${id}`);
};

// DELETE listing
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;

  const deletedListing = await Listing.findByIdAndDelete(id);

  if (!deletedListing) {
    req.flash("error", "Listing You Requested For Does Not Exist");
    return res.redirect("/listings");
  }

  req.flash("success", "Listing Deleted Successfully!");
  res.redirect("/listings");
};
// if(process.env.NODE_ENV != "production"){

//       require('dotenv').config();
// }
// const mongoose = require("mongoose");

// const initData = require("./data.js");

// const Listing = require("../models/listings.js");

// //const MONGO_URL = "mongodb://127.0.0.1:27017/test";

// const dbUrl = process.env.ATLASDB_URL;

// main()
// .then(()=>{

//     console.log("Connected to DB ");
// }).catch((err)=>{
//     console.log(err);
// });

// async function main(){

//     await mongoose.connect(dbUrl);
// }

// const initDB = async ()=>{

//    await Listing.deleteMany({});

//    initData.data = initData.data.map((obj)=>(
//     {
//     ...obj, 
//     owner : '6a04c3b4a81246c98c433d82',
//     geometry :{

//         type: "Point",
//         coordinates: [77.2090, 28.6139],
//     }
    
//     }
// ));

//    await Listing.insertMany(initData.data);

//    console.log("Data was initialized");
// }

// initDB();

if(process.env.NODE_ENV != "production"){


require("dotenv").config({
    path: "../.env"
});

}

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");

const dbUrl = process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(dbUrl);
}

const initDB = async () => {

    await Listing.deleteMany({});

    const modifiedData = initData.data.map((obj) => ({
        ...obj,
        owner: "6a328e88c0b72041d3998c12",
        geometry: {
            type: "Point",
            coordinates: [77.2090, 28.6139],
        }
    }));

    await Listing.insertMany(modifiedData);

    console.log("Data was initialized");
};

main()
.then(async () => {
    console.log("Connected to DB");
    await initDB();
    await mongoose.connection.close();
})
.catch((err) => {
    console.log(err);
});
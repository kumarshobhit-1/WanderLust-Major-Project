// ye file hai jub bhi all data(all listings) delete ho jayee tb isko run karne pe all data recover ho jayega

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() =>{
    console.log("connected to DB");
}).catch(err =>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner : "689c213f2fb4020a69c83966",
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();
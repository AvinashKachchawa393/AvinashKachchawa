const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require("../models/listings.js");
const mongoose_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main()
    .then(()=>{
        console.log("connected to databases");
    })
    .catch(()=>{
        console.log("error connecting to database");
    });

async function main(){
    await mongoose.connect(mongoose_URL);
}

const initialize_Database = async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data was initialize");
}
initialize_Database();
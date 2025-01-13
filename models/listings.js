const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { ref } = require('joi');
const ListingSchema = new Schema({
    title:{type:String,
        required:true
    },
    description:{type:String,
        required:true
    },
    image:{
        filename:String,
        url:String,
       
    },
    price:{type:Number,
        required:true
        },
    location:{type:String,
        required:true
        },
    country:{type:String,
        required:true
        },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    category:{
        type:String,
        enum:["Trending","Rooms","Iconic cities","Mountains","Castles","Amazing pools","Camping","Farms","Arctic","Beach","Top city"]
    }
});
ListingSchema.post('findOneAndDelete',async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
   
});
const listing = mongoose.model('listing',ListingSchema);
module.exports = listing;

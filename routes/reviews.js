const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js');
const expressError=require('../utils/expressError.js');
const {listingSchema,reviewSchema} = require('../Schema.js');
const Review = require('../models/review.js');
const Listing = require('../models/listings.js');
const isLoggedInForReview = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

const validateReview = (req,res,next)=>{
    let {error}  = reviewSchema.validate(req.body);
    if(error){
        throw new expressError(400,error);
    }
    else{
        next();
    }
}
// Reviews
//post route
router.post('/',isLoggedInForReview,validateReview,wrapAsync(reviewController.createReview));
//review delete route
router.delete('/:reviewID',isLoggedInForReview,wrapAsync(reviewController.destoryReview));

module.exports = router;


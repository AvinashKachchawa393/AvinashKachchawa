const Listing = require("../models/listings");
const Review = require("../models/review");

module.exports.createReview= async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.owner=req.user.username;
    newReview.ownerId = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New review add successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.destoryReview = async(req,res)=>{
    let {id,reviewID}=req.params;
    let existingRview = await Review.findById(reviewID);
    //console.log(existingRview.ownerId.equals(res.locals.currUser._id));
    if(!existingRview.ownerId.equals(res.locals.currUser._id)){
        req.flash("error","you don't have permission to delete review");
        return res.redirect(`/listings/${id}`);
    }
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewID}});
    await Review.findByIdAndDelete(reviewID);
    req.flash("success","review deleted successfully");
    res.redirect(`/listings/${id}`);
};
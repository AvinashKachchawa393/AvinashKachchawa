const Listing = require("../models/listings");

module.exports.index = async (req,res)=>{
    const allListing = await Listing.find({});
    res.render('./listings/index.ejs',{allListing});
};

module.exports.renderNewForm = (req,res)=>{
        res.render('./listings/new.ejs');
};

module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested does not exist");
        res.redirect("/listings");
    }
    else{
        if(!listing.owner.equals(res.locals.currUser._id)){
            req.flash("error","you don't have permission to edit listing");
            return res.redirect(`/listings/${id}`);
        }
        let originalImage = listing.image.url;
        originalImage=originalImage.replace("/upload","/upload/h_150,w_250");
        res.render('./listings/edit.ejs',{listing,originalImage});
    }
};

module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
    let list = await Listing.findById(id);
    if(!list.owner.equals(res.locals.currUser._id)){
       
        req.flash("error","you don't have permission to edit listing");
        return res.redirect(`/listings/${id}`);
    }
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
        req.flash("success","Listing updated successfully");
        return res.redirect(`/listings/${id}`);  
    
};

module.exports.destoryListing = async (req,res)=>{
    let {id}= req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","you don't have permission to delete listing");
        return res.redirect(`/listings/${id}`);
    }
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted successfully");
    res.redirect('/listings');
};

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate('reviews').populate('owner');
    if(!listing){
        req.flash("error","Listing you requested does not exist");
        res.redirect('/listings');
    }
    else{
        res.render('./listings/show.ejs',{listing});
    }
};

module.exports.createListing = async(req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing=new Listing(req.body.listing);
    //console.log(newListing);
    newListing.owner=req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success","Listing is successfully added");
    res.redirect('/listings');  
    
};
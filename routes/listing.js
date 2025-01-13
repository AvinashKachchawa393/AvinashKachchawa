const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const {listingSchema,reviewSchema} = require('../Schema.js');
const expressError=require('../utils/expressError.js');
const Listing = require('../models/listings.js');
// const isloggedIn =require('../middleware.js');
const listingController = require('../controllers/listings.js');
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage});

const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new expressError(400,error);
    }
    else{
        next();
    }
}

const isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","you must be logged in to create listing");
        res.redirect('/login');
    }
    else{
        next();
    }
}

//index route
router.get('/', wrapAsync(listingController.index));

//new
router.get('/new',isLoggedIn,listingController.renderNewForm);

//show route
router.get('/:id', wrapAsync(listingController.showListing));

//create route
router.post('/',isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));
// router.post('/',upload.single('listing[image]'),(req,res)=>{
//     res.send(req.file);
// });  
// Edit route
router.get('/:id/edit',isLoggedIn,wrapAsync( listingController.renderEditForm));

// update route
router.put('/:id',isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing));

//delete route
router.delete('/:id',isLoggedIn,wrapAsync(listingController.destoryListing));

module.exports = router;
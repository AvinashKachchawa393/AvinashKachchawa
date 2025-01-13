if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express=require('express');
const app=express();
const port=8080;
const mongoose=require('mongoose');
const dbURL = process.env.ATLASDB_URL;
const Listing = require('./models/listings.js');
const path = require('path');
const methodOverride = require('method-override');
const ejs_mate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const expressError=require('./utils/expressError.js');
const {listingSchema,reviewSchema} = require('./Schema.js');
const Review = require('./models/review.js');
const listing = require('./routes/listing.js');
const reviews = require('./routes/reviews.js');
const user = require('./routes/user.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport =require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

  
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejs_mate);
app.use(express.static(path.join(__dirname,'/public')));

const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto: {
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600,
});
store.on("error",()=>{
    console.log("ERROR in mongo session store",err);
});
app.use(session({
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    }
}));
app.use(flash());
app.use(passport.initialize());//passport initialization
app.use(passport.session());//passport session
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());//store information in session
passport.deserializeUser(User.deserializeUser());//remove information in session

main()
    .then(()=>{
        console.log('connect to db');
    })
    .catch((err)=>{
        console.log(err);
    });
async function main(){
    await mongoose.connect(dbURL);
}
app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next(); 
});
app.use('/listings',listing);
app.use('/listings/:id/reviews',reviews);
app.use('/',user);

app.get("/listings/:category/filters",async(req,res)=>{
    let {category} = req.params;
    let allListing = await Listing.find({category:category});
    if(allListing.length===0){
        req.flash("success","We apologize, but no listings are currently available that match the selected filter criteria.");
        res.redirect("/listings");
    }
    else{
        res.render("./listings/index.ejs",{allListing});
    }
      
    
});
app.post("/listings/search",async(req,res)=>{
    let {search} = req.body;   
    let allListing = await Listing.find({country:search});
    if(allListing.length===0){
        req.flash("success","No Results Found");
        res.redirect("/listings");
    }
    else{
        res.render("./listings/index.ejs",{allListing});
    }
    
});

app.all("*",(req,res,next)=>{
    next(new expressError(400,"Page not found"));
});
app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"} = err;
    res.render('error.ejs',{message});
});

app.listen(port,()=>{
    console.log(`Server is Listing at : ${port}`);
});
const User = require("../models/user");

module.exports.renderSignupForm = (req,res)=>{
    res.render('./users/signup.ejs');
};

module.exports.signup = async(req,res)=>{
    try{
        let {username,email,password} = req.body;
    let newUser = new User({email,username});
    let userInfo = await User.register(newUser,password);
    req.login(userInfo,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to WanderLust");
        res.redirect('/listings');
    });
    
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
};

module.exports.renderLoginForm = (req,res)=>{
    res.render('./users/login.ejs');
};

module.exports.login = async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust");
    res.redirect("/listings");
};

module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged out successfully");
        res.redirect("/listings");
    });

};
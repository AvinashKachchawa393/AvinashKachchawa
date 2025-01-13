const isLoggedInForReview = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","you must be logged in to create review");
        res.redirect('/login');
    }
    else{
        next();
    }
}
module.exports = isLoggedInForReview;
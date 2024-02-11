// const Listing  = require("./models/listing");
// const owner = require("./models/listing")
// const ExpressError = require("./utils/ExpressError.js");
// const {listingSchema , reviewSchema} =  require("./schema.js");

module.exports.isLoggedIn = (req,res,next) => {
    // console.log(req.user);
    // console.log(req);
    // console.log(req.path,"..",req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be  logged in to create listings!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// module.exports.isOwner = async (req,res,next) =>{
//     let { id } = req.params;
//     let listing = await Listing.findById(id);
//     if(!listing.owner.equals(res.locals.currUser._id)){
//         req.flash("error","You dont have not owner of thesse listings");
//         return res.redirect(`/listings/${id}`);
//     }
//     next();
// };





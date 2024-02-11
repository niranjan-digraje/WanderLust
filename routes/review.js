const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} =  require("../schema.js");
const Review = require("../models/review.js");
const { isLoggedIn } = require("../middleware.js");
const Listing = require = require("../models/listing.js");

//---------------validate review------------------------
const validateReview = (req,res,next) => {
    let{error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};


//--------------------scehema validation from schema.js-----------------

router.post("/" ,isLoggedIn,validateReview,async (req,res) => {
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    // console.log("new review saved");
    // res.send("new review saved");
    req.flash("success","New Review Created !");
    res.redirect(`/listings/${listing._id}`);
});





//---------------------delete review---------------------------
router.delete("/:reviewId" , async (req,res) => {
    let {listingId , reviewId} = req.params;
    await Listing.findByIdAndUpdate(listingId , {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted !");
    res.redirect(`/listings/${id}`);
});


module.exports = router;
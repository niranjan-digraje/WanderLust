const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema , reviewSchema} =  require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


//--------------validate listing-------------------
const validateListing = (req,res,next) => {
    let{error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

//------------------5)printing output data on browser-------------------------------
//priint result on browser


router.get("/",wrapAsync(listingController.index));

//------------------7)show all data according to id---------------------------------
//2)new route///new.ejs
router.get("/new",isLoggedIn,listingController.renderNewForm);

//1)show route///show.ejs
router.use(express.urlencoded({extended: true}));
router.get("/:id", wrapAsync(listingController.showListings));

//3)create route///new.ejs

//const ExpressError = require("./utils/ExpressError.js");
router.post("/",isLoggedIn,upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListings));
// router.post("/",(req,res) => {
//     res.send(req.file);
// });
//4)edite route//show.ejs///edit.ejs
const methodOverride = require("method-override");
router.use(methodOverride("_method"));
router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.editListing));

//5)update route///edit.ejs
router.put("/:id",isLoggedIn,upload.single('listing[image]'),wrapAsync(listingController.updateListing));

//6)delete route///show.ejs
// router.delete("/listings/:id",async (req,res) => {
//     let {id} = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     res.redirect("/listings");
// });
router.delete("/:id",isLoggedIn, wrapAsync(listingController.deleteListing));


// //for all
// router.all("*",(req,res,next) => {
//     next(new ExpressError(404,"Page not Found!"));
// });

module.exports = router;

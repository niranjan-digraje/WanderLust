//-----------------1)Basic setup to create before starting project--------------------

//require env file
if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
//console.log(process.env.SECRET);

//1)require all packages
const { log } = require("console");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("./models/user.js");

const listings = require("./routes/listing.js");
const listingRouter = require("./models/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//4)create database in mongodb and connect to .js file
//const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const dbUrl = process.env.ATLASDB_URL;
main()
.then(()=>{
    console.log("connected to db");
})
.catch((err) =>{
    console.log(err);
});
async function  main(){
    //await mongoose.connect(MONGO_URL);
    await mongoose.connect(dbUrl);
}

//------------------session---------------------
const session = require("express-session");
const MongoStore = require('connect-mongo');

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error",()=>{
    console.log("error in mongo session store",err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};


app.use(session(sessionOptions));

//------------------flash-------------------------
const flash = require("connect-flash");
app.use(flash());
app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    // console.log(res.locals.success);
    next();
});

//-----------------passport-------------------
app.use(passport , passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// //demouser
// app.get("/demouser", async(res,req) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student",
//     });
//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// });

// //3)request send to browser
// app.get("/" , (req,res) => {
//     res.send("Hi,I am root");
// });

//2)to start server
app.listen(8080 , ()=>{
    console.log("server is listening to port 8080");
});

//----------------------------------------------------------------------------------
const path  = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


//-----------------3)requiring Listing model from listing.js--------------------------
//1)requiring listing.js



//2)creating routs and documents
// app.get("/testListing", async (req,res) => {
//     let sampleListing = new Listing({
//         title : "My New Villa",
//         description : "By the beach",
//         price : 1200,
//         location : "Calangute , Goa",
//         country : "India",
//     });
//     await sampleListing.save();
//     console.log("sample was save");
//     res.send("successfull testing");
// });

//--------------------11)styling--------------------------------------------------
const ejsMate = require("ejs-mate");
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

//---------------------Handling Errors---------------------------

app.use((err,req,res,next) => {
    let {statusCode , message} = err;
    //res.status(statusCode).send(message);
    res.render("error.ejs",{message});
    //res.send("Something went wrong!");
});

app.use("/listings",listings);
app.use("/listings/:id/reviews" ,reviewRouter);
app.use("/",userRouter);

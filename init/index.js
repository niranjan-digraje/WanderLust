//.................4)require sample data data.js--------------------------------------

//1)require data.js
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

//2)create connection
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
main()
.then(()=>{
    console.log("connected to db");
}).catch((err) =>{
    console.log(err);
});
async function  main(){
    await mongoose.connect(MONGO_URL);
}

//3)initialise database
const initDB = async () => {
    //first clean all data
    await Listing.deleteMany({});
    // initData.data = initData.data.map((obj) => ({...obj,owner: "65ba3aaccbe1fa4da5d9fbb5"}));
    initData.data = initData.data.map((obj) => ({...obj,owner: "65c86039177d26fe1e33f18a"}));
    await Listing.insertMany(initData.data);
    console.log("data was initilized");
}

//4)call initDB function
initDB();
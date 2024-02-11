//-----------------2)listing the models in mongodb---------------------
//1)require mongoose and store there schema in any veriable
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

//2)creating listing schema
const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : String,
    // image : {
    //     type : String,
    //     default : "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphoto%2Fhot-tea-and-conversation-concept-gm861139992-142538541&psig=AOvVaw1SH7xlnCRWed9kVL8r6eNk&ust=1705670661633000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCNCykMuE54MDFQAAAAAdAAAAABAQ" ,
    //     set : (v) => 
    //     v === " " 
    //     ? "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphoto%2Fhot-tea-and-conversation-concept-gm861139992-142538541&psig=AOvVaw1SH7xlnCRWed9kVL8r6eNk&ust=1705670661633000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCNCykMuE54MDFQAAAAAdAAAAABAQ" 
    //     : v,
    // },
    image : {
        url: String,
        filename: String,
    },
    price : Number,
    location : String,
    country : String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    
});

//3)creating model using 2)above listing and export in app.js
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;

//delete
listingSchema.post("findOneAndDelete" , async (listing) =>  {
    if(listing){
        await Review.deleteMany({_id : {$in: listing.reviews}});
    }
});
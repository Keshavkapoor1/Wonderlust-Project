const mongoose=require("mongoose");
const { Schema } = mongoose;
const Review=require("./review.js");

const listingSchema=new mongoose.Schema({
    title:{
        type:String,
       //n required:true,
    },
    description:{
      type:String,
    },
    image: {
       url:String,
       filename:String,
        },
        
      
    
    country:String,
    location:String,
    price:Number,
reviews:[{
  type:Schema.Types.ObjectId,
  ref:"Review",
},],
owner:{
   type:Schema.Types.ObjectId,
  ref:"User",
}
})

listingSchema.post("findOneAndDelete",async(listing)=>{
 if(listing){
  
  await Review.deleteMany({id:{$in:listing.reviews}});
 }
})

const listing=mongoose.model("listing",listingSchema);
module.exports=listing;
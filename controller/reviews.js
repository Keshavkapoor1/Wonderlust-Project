const listing=require("../models/listing.js");
const Review=require("../models/review.js");

module.exports.createreview=async(req,res)=>{
    let {id}=req.params;
   let listingfind= await listing.findById(req.params.id);
   let newReview=new Review(req.body.review);
   newReview.author=req.user._id;
   listingfind.reviews.push(newReview);
   console.log(newReview);
   await newReview.save();
   await listingfind .save();
    req.flash("sucess","New Review created");
   console.log("saved");
  res.redirect(`/listings/${id}`);
}


module.exports.destoryreview=async (req, res) => {
    let { id, reviewId } = req.params;

    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    await Review.findByIdAndDelete(reviewId);
 req.flash("sucess","Review Deleted");
    res.redirect(`/listings/${id}`);
}
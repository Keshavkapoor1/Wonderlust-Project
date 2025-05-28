const express=require ("express");
const router=express.Router({mergeParams:true});
const asyncwrap=require("../utils/asyncwrap.js");
const Review=require("../models/review.js");
const listing=require("../models/listing.js");
const{validateReview,isloggedIn,isauthor}=require("../middleware.js");
const reviewController=require("../controller/reviews.js");
//create
router.post("/",isloggedIn,validateReview,asyncwrap (reviewController.createreview));

/* delete review */
router.delete("/:reviewId", isloggedIn,isauthor,asyncwrap(reviewController.destoryreview));

module.exports=router;
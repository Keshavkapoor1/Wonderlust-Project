const listing=require("./models/listing.js");
const {listingSchema}=require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");
const {reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");
module.exports.isloggedIn=(req,res,next)=>{
     if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must logged in to delete listing!");
       return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if( req.session.redirectUrl){
         res.locals.redirectUrl= req.session.redirectUrl;
    }
    next();
}


module.exports.isowned=async(req,res,next)=>{
let {id}=req.params;
let listings=await listing.findById(id);
if(!listings.owner.equals(res.locals.currUser._id)){
    req.flash("error","you are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
}
next();
}

module.exports. validatestring=((req,res,next)=>{
    const { error } = listingSchema.validate(req.body.listing);
    if (error){
        throw new ExpressError(400, error);

    }
    else{
        next();
    }
});

module.exports. validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
    
    throw new ExpressError( 400,error);
    }
    next();
};

module.exports.isauthor=async(req,res,next)=>{
let {id,reviewId}=req.params;
let review=await Review.findById(reviewId);
if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","you are not the author of this review");
    return res.redirect(`/listings/${id}`);
}
next();
}
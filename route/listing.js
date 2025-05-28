const express=require ("express");
const router=express.Router();

const {reviewSchema,listingSchema}=require("../schema.js");
const listing=require("../models/listing.js");

const asyncwrap=require("../utils/asyncwrap.js");
const{isloggedIn,isowned,validatestring}=require("../middleware.js");
const listingcontroller=require("../controller/listing.js")

const multer=require("multer");
const{storage}=require("../clouddinary.js")
const upload=multer({storage});

router
.route("/")
.get(asyncwrap(listingcontroller.index))
.post(isloggedIn,upload.single("image"),validatestring,asyncwrap(listingcontroller.createlisting));


router.get("/", asyncwrap(listingcontroller.index));
router.get("/new",isloggedIn,listingcontroller.renderNewForm);

router
.route("/:id")
.put(isloggedIn,isowned,upload.single("image"),validatestring,asyncwrap(listingcontroller.updatelisting))
.delete(isloggedIn,isowned,asyncwrap(listingcontroller.destroylisting))
.get(asyncwrap(listingcontroller.showlisting));

//new


// create


//edit route
router.get("/:id/edit",isloggedIn,isowned,asyncwrap(listingcontroller.editlisting));

//update


//delete


//show route



module.exports=router;

const listing=require("../models/listing.js");

/*module.exports.index=async(req,res)=>{
    let listings=await listing.find();
    res.render("listings/index.ejs",{listings});
}*/


module.exports.index = async (req, res) => {
  let query = {};

  if (req.query.q) {
    // case-insensitive search on 'location' or 'title' fields (aap apne fields adjust kar sakte hain)
    query = {
      $or: [
        { location: { $regex: req.query.q, $options: "i" } },
        { title: { $regex: req.query.q, $options: "i" } },
      ],
    };
  }

  let listings = await listing.find(query);
  res.render("listings/index.ejs", { listings, q: req.query.q });
};




module.exports.renderNewForm=(req,res)=>{
  
    res.render("listings/new.ejs");

}


module.exports.showlisting=(async(req,res)=>{
    let {id}=req.params;
     let listings=await listing.findById(id).populate({
        path: "reviews",
        populate: { path: "author" },
    })
    .populate("owner");
     console.log(listings);
     
if(!listings){
    req.flash("error","listing you request for does not exist !");
   return res.redirect("/listings");
}
     res.render("listings/show.ejs",{listings})
})



module.exports.createlisting=async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    const {title,description,image,location,price,country}=req.body;
    
    
    let newlisting=new listing({
        title:title,
        description:description,
        image:image,
        price:price,
        location:location,
        country:country,
        
    });
    newlisting.image={url,filename};
    newlisting.owner=req.user._id;
     await newlisting.save().then((ch)=>{
       // console.log(ch);
       req.flash("sucess","New listing created");
    });
    res.redirect("/listings");
}



module.exports.editlisting=async(req,res)=>{
     
    let {id}=req.params;
   let listings = await listing.findById(id);
   if(!listings){
    req.flash("error","listing yourequested does not exist!");
     return res.redirect("/listings");
 }
let originalimage = listings.image.url;

res.render("listings/edit.ejs", { listings, originalimage });
}

module.exports.updatelisting=async(req,res)=>{
     
    let {id}=req.params;
    let {description,title,price,location,country}=req.body;
    
    
    let ulistings=await listing.findByIdAndUpdate(id,{description,title,price,location,country});
     if (req.file) {
      const url = req.file.path;
      const filename = req.file.filename;
      ulistings.image = { url, filename };
      await ulistings.save();
    }
 req.flash("sucess","listing updated");
 
    res.redirect(`/listings/${id}`);
}

module.exports.destroylisting=async(req,res)=>{
    
    let {id}=req.params; 
    let dlisting=await listing.findByIdAndDelete(id);
     req.flash("sucess","listing Deleted");
    res.redirect("/listings");

}


const user=require("../models/user.js");

module.exports.rendersignup=(req,res)=>{
res.render("users/signup.ejs")
}


module.exports.signup=async(req,res)=>{
   try{
     let {username,email,password}=req.body;
    const newUser=new user({email,username});
    const registeruser=await user.register(newUser,password);
    req.login(registeruser,(err)=>{
if(err){
    next(err);
}
 req.flash("sucess","user was register");
   res.redirect("/listings");
    })
   console.log(registeruser);
  
   }
   catch(e){
req.flash("error",e.message);
  res.redirect("/signup");
   }
    
}



module.exports.renderlogin=(req,res)=>{
  res.render("users/login.ejs");  
}


module.exports.login=async(req,res)=>{
    req.flash("sucess","Welcome back to Wonderlust");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}


module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return  next(err);
        }
        req.flash("sucess","you are logged out");
        res.redirect("/listings");
    })
}
const express=require ("express");
const router=express.Router();
const user=require("../models/user.js");
const asyncwrap=require("../utils/asyncwrap.js");
const passport=require("passport");
const{saveRedirectUrl}=require("../middleware.js");
const userController=require("../controller/user.js");



router
.route("/signup")
.get(userController.rendersignup)
.post(asyncwrap(userController.signup));



router
.route("/login")
.get(userController.renderlogin)
.post(saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
}),
userController.login
);


router.get("/logout",userController.logout);
module.exports=router;
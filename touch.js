if(process.env.NODE_ENV!="production"){
require("dotenv").config();
}
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const port=8080;
const path=require("path");
const ExpressError=require("./utils/ExpressError.js");
const listings=require("./route/listing.js");
const reviews=require("./route/review.js");
const users=require("./route/user.js");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const user=require("./models/user.js");

const session=require("express-session")
const MongoStore=require("connect-mongo");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));


app.use(express.static(path.join(__dirname,"public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const methodOverride=require("method-override");
app.use(methodOverride("_method"));

const ejsmate=require("ejs-mate");

app.engine("ejs",ejsmate);

const dburl=process.env.ATLASDB_URL;
async function main(){
    await mongoose.connect(process.env.ATLASDB_URL);
}main().then((res)=>{
    console.log("working")
})
.catch((err)=>{
    console.log(err);
});


app.listen(port,()=>{
    console.log("listening");
})

const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})
store.on("error",()=>{
    console.log("error in mongo session store,err");
})
app.use(session({ 
     store,
     secret:process.env.SECRET,
   
    resave:false,
    saveUninitialized:true,
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use((req,res,next)=>{
    res.locals.sucess=req.flash("sucess");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})
 
/*app.get("/demouser",async(req,res)=>{
    let fakeuser=new user({
        email:"student@gmail.com",
        username:"delta-student",
    });

  const register=await user.register(fakeuser,"helloworld");
  res.send(register);
});*/

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);   
app.use("/",users);

/*app.all("*",(req,res,next)=>{
    return (new ExpressError(404,"Page not found"));
});*/

app.use((err,req,res,next)=>{
    let{status=500,message="something went wrong"}=err;

  res.status(status).render("listings/error.ejs",{message});
});



var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var passsport=require("passport");
var localStrategy=require("passport-local");
var Campground=require("./models/campground");
var Comment=require("./models/comment");
var User=require("./models/user");
var methodOverride=require("method-override");
var flash = require("connect-flash");
var seedDB=require("./seeds");
mongoose.set('useFindAndModify', false);

//requiring routes
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments"),
    authRoutes       = require("./routes/index");

//seeds database
//seedDB();
mongoose.connect("mongodb://localhost/yelp_camp_v12", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));  
app.use(methodOverride("_method"));
app.use(flash());

//Passport config
app.use(require("express-session")({
    secret:"i have a gf",
    resave:false,
    saveUninitialized:false
}));

app.use(passsport.initialize());
app.use(passsport.session());
passsport.use(new localStrategy(User.authenticate()));
passsport.serializeUser(User.serializeUser());
passsport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});

app.use(authRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(3000,function(){
    console.log("Server Started !");
});
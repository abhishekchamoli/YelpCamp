var express=require("express");
var passsport=require("passport");
var router=express.Router();
var User=require("../models/user");

//index route
router.get("/",function(req,res){
    res.render("landing");
});

//register
router.get("/register",function(req,res){
    res.render("register");
});

//register handling
router.post("/register",function(req,res){
    var newUser=new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            req.flash("error",err.message);
            return res.redirect("/register");
        }
        passsport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome to Yelpcamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//Login route
router.get("/login",function(req,res){
    res.render("login");
});

//login logic
router.post("/login",passsport.authenticate("local",
    {successRedirect:"/campgrounds",
    failureRedirect:"/login"
    }),function(req,res){
});

//logout
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Successfully logged out");
    res.redirect("/campgrounds");
});

module.exports=router;
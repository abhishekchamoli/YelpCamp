var express=require("express");
var Campground=require("../models/campground");
var middleWare = require("../middleware");
var router=express.Router();


//campgrounds route
router.get("/",function(req,res){
    //get all campgrounds
    Campground.find({},function(err,allCampgrounds){
        if(err)
        {
            console.log(err);
        }else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds});
        }
    });
}); 

//Add a campground
router.post("/",middleWare.isLoggedIn,function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var description=req.body.description;
    var author={
        id:req.user._id,
        username:req.user.username
    };
    var price = req.body.price;
    var newCampground={name:name , image:image, description:description,author:author,price:price};
    Campground.create(newCampground,function(err,newlyCreated){
        if(err)
        {
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    })
});

//new campground form
router.get("/new",middleWare.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});

//show route
router.get("/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err)
        {
            console.log(err);
        }else{
            res.render("campgrounds/show",{campground:foundCampground});
        }
    });
});

//Edit campground route
router.get("/:id/edit",middleWare.checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        res.render("campgrounds/edit",{campground:foundCampground});
    });
    
});

//Update campground route
router.put("/:id",middleWare.checkCampgroundOwnership,function(req,res){
    //find campground and update
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err)
        {
            res.redirect("/campgrounds");
        }else{
            req.flash("success","Campground Updated");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Destroy campground route
router.delete("/:id",middleWare.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            req.flash("success","Campground Deleted");
            res.redirect("/campgrounds");
        }
    })
});

module.exports=router;
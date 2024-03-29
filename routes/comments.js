var express=require("express");
var Campground=require("../models/campground");
var router=express.Router({mergeParams:true});
var Comment=require("../models/comment");
var middleWare = require("../middleware");

//new comment route
router.get("/new",middleWare.isLoggedIn,function(req,res){
    //find campground by id
    Campground.findById(req.params.id,function(err,campground){
        if(err)
        {
            console.log(err);
        }else
        {
            res.render("comments/new",{campground:campground});
        }
    });
    
});

//posting a comment
router.post("/",middleWare.isLoggedIn,function(req,res){
    //find campground by id
    Campground.findById(req.params.id,function(err,campground){
        if(err)
        {
            console.log(err);
            res.render("/campgrounds");
        }else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }else{
                    //add username and id to comment
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","Successfully Added comment");
                    res.redirect('/campgrounds/'+ campground._id);
                }
            });
        }
    });
});

router.get("/:comment_id/edit",middleWare.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit",{campground_id:req.params.id,comment:foundComment});
        }
    });
});

//update comment
router.put("/:comment_id",middleWare.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success","Comment Updated");
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});

//delete comment
router.delete("/:comment_id",middleWare.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success","Comment Deleted");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

module.exports=router;
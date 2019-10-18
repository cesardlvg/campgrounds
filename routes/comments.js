const express = require("express");
// express merges user params to associate posts with users
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var	Comment = require("../models/comment");
var middleware = require("../middleware");

// ===============================
// COMMENTS ROUTES
// ===============================

// comments new - get post to associate with comment
router.get("/new", middleware.isLoggedIn, function(req, res){
	//find campground by id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
				res.render("comments/new", {campground: campground});
		}
	});
});


// add comment - to associated post 
router.post("/", middleware.isLoggedIn, function(req, res){
	//loook up campground using id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			//create new comment
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "something went wrong");
					console.log(err);
				} else {
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment 
					comment.save();
					//connect comment to post
					campground.comments.push(comment);
					campground.save();
					//redirect to campground show page. 
					req.flash("success", "You added a comment!");
					res.redirect('/campgrounds/' + campground._id);
				} 
			});
		}
	});
});


// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err || !foundCampground) {
			req.flash("error", "No campground found");
			return res.redirect("back");
		}
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back");
			} else {
				res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
			}
		});
	}); 
});

// Comment Update

 router.put("/:comment_id", function(req, res){
	 	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
 			res.redirect("back");
 		} else {
 			res.redirect("/campgrounds/" + req.params.id);
 		}
 	});
 });

// Comment Destroy route

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	//find by id and remove
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			req.flash("success", "You deleted your comment");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

module.exports = router;
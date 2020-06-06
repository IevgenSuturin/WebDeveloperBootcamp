var express    = require("express"),
	router     = express.Router({mergeParams: true}),
	Campground = require("../models/campground"),
	Comment    = require("../models/comment"),
	middleware = require("../middleware");


//Comments new
router.get("/new", middleware.isLogedIn, (req, res)=>{
	Campground.findById(req.params.id, (error, foundCampground)=>{
		if(error){
			console.log(error);
		} else {
			res.render("comments/new", {campground: foundCampground});
		}
	});
});

//Comments create
router.post("/", middleware.isLogedIn, (req, res)=>{
	//look campground using id
	Campground.findById(req.params.id, (error, foundCampground)=>{
		if(error){
			console.log(error);
			redirect("/campgrounds");
		} else {
			//create new comment
			Comment.create(req.body.comment, (error, newComment)=>{
				if(error){
					req.flash("error", "Something want wrong!");
					console.log(error);
					redirect("/campgrounds");
				} else {
					//add username and id to campground
					 newComment.author.username = req.user.username;
					 newComment.author.id = req.user._id;
					//save comment
					 newComment.save();
					//connect new comment for campground
					foundCampground.comments.push(newComment._id);
					foundCampground.save();
					req.flash("success", "Succesfully added comment!")
					//redirect to campground show page
					res.redirect("/campgrounds/"+foundCampground._id);
				}
			});
			
		}
	});
});


//comment edit
router.get("/:comment_id/edit",  middleware.checkCommentOwnership, (req, res)=>{
	Comment.findById(req.params.comment_id, (error, foundComment)=>{
		if(error){
			req.flash("error", "Comment not found!");
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted!");
			res.render("comments/edit", {comment: foundComment, campground_id: req.params.id});
		}
	});
});

//comment update
router.put("/:comment_id",  middleware.checkCommentOwnership, (req, res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (error, updatedComment)=>{
		if(error){
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

//comment delete
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
	Comment.findByIdAndRemove(req.params.comment_id, (error)=>{
		if(error){
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/"+req.params.id);
		}
	});	  
});

module.exports = router;
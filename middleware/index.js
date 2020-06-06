var Campground = require("../models/campground"),
	Comments   = require("../models/comment");
// all the mmiddleware goes here

var mmiddlewareObj = {};

mmiddlewareObj.checkCampgroundOwnership = (req, res, next)=>{
		if(req.isAuthenticated()){
		Campground.findById(req.params.id, (error, foundCampground)=>{
			if(error){
				req.flash("error", "Campground not found!")
				res.redirect("back");
			} else {
				//does the user own tha campground?
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You don't have permition to do that!")
					res.redirect("back");
				}
			}
		});
	} else {
		red.flash("error", "You need to be logged in to do that!")
		res.redirect("back");
	}
};

mmiddlewareObj.checkCommentOwnership = (req, res, next)=>{
		if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, (error, foundComment)=>{
			if(error){
				res.redirect("back");
			} else {
				//does the user own tha campground?
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("You don't have permition to do that!")
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("back");
	}
}

mmiddlewareObj.isLogedIn = (req, res, next)=>{
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that!");
	res.redirect("/login");
};



module.exports = mmiddlewareObj;
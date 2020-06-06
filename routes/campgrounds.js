var express = require("express"),
	router  = express.Router(),
	Campground = require("../models/campground"),
	middleware = require("../middleware");


//INDEX - display all campgrounds
router.get("/", (req, res)=>{
	Campground.find({}, (err, allCampgrounds)=>{
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});	
		}
	});
});

//NEW form to create a new campground
router.get("/new", middleware.isLogedIn, (req, res)=>{
	res.render("campgrounds/new");
});

//CREATE new campground
router.post("/", middleware.isLogedIn, (req, res)=>{
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	Campground.create({name: name, price: price, image: image, description: description, author: author}, (error, newCampground)=>{
		if(error){
			console.log(error);
		} else {
			res.redirect("/campgrounds");
		}
	});
});

//SHOW - display single campground
router.get("/:id", (req, res)=>{
	//Find campground {with provided provided id
	Campground.findById(req.params.id).populate("comments").exec((error, foundCampground)=>{
		if(error){
			req.flash("error", "Campground was not found!")
		} else {
			//Show the campgroung
			res.render("campgrounds/show", {campground: foundCampground});		
		}
	});
});

//Edit campground rout
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res)=>{
	Campground.findById(req.params.id, (error, foundCampground)=>{
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

//Update campground rout
router.put("/:id", middleware.checkCampgroundOwnership, (req, res)=>{
	//Find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (error, updatedCampground)=>{
		if(error){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
	//redirect somewhere
});

//Delete campground
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res)=>{
	Campground.findByIdAndRemove(req.params.id, (error)=>{
		if(error){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;
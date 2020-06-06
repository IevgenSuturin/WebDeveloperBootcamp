var express  = require("express"),
	router   = express.Router(),
	passport = require("passport"),
	User     = require("../models/user");

//Route rout
router.get("/", (req, res, next)=>{
	res.render("landing");
	next();
});

//Register form rout
router.get("/register", (req, res)=>{
	res.render("register");
});

//handle signup logic
router.post("/register", (req, res)=>{
	User.register(new User({username: req.body.username}), req.body.password, (error, user)=>{
		if(error){
			console.log(error.message);
			req.flash("error", error.message);
			return res.render("register");
		} 
		passport.authenticate("local")(req, res, ()=>{
			req.flash("success", "Welcome to YelpCamp " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

//show login form
router.get("/login", (req, res)=>{
	res.render("login");
});

//handle login form rout
router.post("/login", passport.authenticate("local",{
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), (res, req)=>{});

//logout rout
router.get("/logout", (req, res)=>{
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");
});

module.exports = router;
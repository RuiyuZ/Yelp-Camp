var express		= require("express"),
	passport	= require("passport"),
	router		= express.Router(),
	User 		= require("../models/user");

router.get("/", function(req, res){
	res.render("landing");
});


// AUTH ROUTES
// Show Register form
router.get("/register", function(req, res){
	res.render("register");
});

// Handle user sign up logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp " + user.username + "!");
			res.redirect("/campgrounds");
		});
	});
});

// LOGIN ROUTES
// render login form
router.get("/login", function(req, res){
	res.render("login");
});
// login logic, Use MIDDLEWARE!
router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req, res){
});


// LOGOUT ROUTES
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged You Out!");
	res.redirect("/campgrounds");
});


module.exports = router;
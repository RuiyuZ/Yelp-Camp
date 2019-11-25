var Campground 	= require("../models/campground"),
	Comment		= require("../models/comment");
// ALL MIDDLEWARE GOES HERE
var middlewareObj = {};

// MIDDLEWARE: Check Campground Ownership
middlewareObj.checkCampgroundOwnership = function(req, res, next){
	// if user logged in
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				req.flash("error", "Campground not found");
				res.redirect("back");
			}else{
				// does user own campground
				if(foundCampground.author.id.equals(req.user._id)){
					next();	
				}else{
					// otherwise, redirect
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});	
	}else{
		// if not, redirect
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}


// MIDDLEWARE: Check Comment Ownership
middlewareObj.checkCommentOwnership = function(req, res, next){
	// if user logged in
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err || !foundComment){
				req.flash("error", "Comment not found");
				res.redirect("back");
			}else{
				// does user own campground?
				if(foundComment.author.id.equals(req.user._id)){
					next();	
				}else{
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});	
	}else{
		// if not, redirect
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}


// MIDDLEWARE : is logged in
middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
}

module.exports = middlewareObj;
var express					= require("express"),
	app 					= express(),
	request 				= require("request"),
	bodyParser 				= require("body-parser"),
	mongoose 				= require("mongoose"),
	flash					= require("connect-flash"),
	passport				= require("passport"),
	User					= require("./models/user"),
	LocalStrategy 			= require("passport-local"),
	methodOverride			= require("method-override"),
	PassportLocalMongoose 	= require("passport-local-mongoose"),
	Campground				= require("./models/campground"),
	Comment					= require("./models/comment"),
	seedDB					= require("./seeds");

// requiring routes
var commentRoutes 		= require("./routes/comments"),
	campgroundRoutes 	= require("./routes/campgrounds"),
	indexRoutes 			= require("./routes/index");
	

mongoose.set('useUnifiedTopology', true);

//console.log(process.env.DATABASEURL);
//mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });

mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true });
//mongoose.connect('mongodb+srv://etain42:zry@0808@cluster0-pi2ip.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true });
// mongodb+srv://etain42:zry@0808@cluster0-pi2ip.mongodb.net/test?retryWrites=true&w=majority
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));
// seedDB(); // Seed the data base

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "I love my dog!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended:true}));
app.use(flash());

passport.use(new LocalStrategy(User.authenticate())); // User.authenticate() comes from passport-local-mongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// add function that will called on every route
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// in the end
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});
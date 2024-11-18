if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require("express");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const app = express();
const { isLoggedIn } = require("./middleware.js");
const { saveRedirectUrl } = require("./middleware.js");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js");
// use session when project is in dev state, in production state use mongoose session store(npm pacakge)

const store = MongoStore.create({
    mongoUrl: process.env.Mongo_atlas_link,
    crypto: {
        //provides encryption
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600 //session exists interval here its 24hrs
})
store.on("error", () => {
    console.log("Error in Mongo Session Store", err);
})

const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};
const multer = require('multer');
const { storage } = require("./cloudConfig.js")
const upload = multer({ storage })// dest is destination uploads/ is a folder where files will be saved and multer is a method here







//middlewares
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());// it shoulb be placed below session middlewere
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
main().then(() => { console.log("connection successful") });
const ejsMate = require("ejs-mate");
app.engine('ejs', ejsMate);
const wrapAsync = require("./utils/wrapAsync.js");
const expressErr = require("./utils/expressErr.js");

async function main() {
    await mongoose.connect(process.env.Mongo_atlas_link)
}

app.listen(3000, () => {
    console.log("app listening");
})
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.userDetails = req.user;
    // ejs can access res.locals 
    next();
});

const listingController = require("./controllers/listings.js");
const reviewController = require("./controllers/reviews.js");
const userController = require("./controllers/users.js");

app.get("/listings", wrapAsync(listingController.home));

app.get("/", wrapAsync(listingController.RedirectToListings));

app.get("/listings/new/", isLoggedIn, wrapAsync(listingController.NewListingForm));

app.get("/listings/:id", wrapAsync(listingController.listingDetail));

app.get("/listings/:id/edit", isLoggedIn, wrapAsync(listingController.editlistingform));

app.get("/signup", wrapAsync(userController.signupform));

app.get("/login", wrapAsync(userController.loginform));

app.get("/logout", wrapAsync(userController.logout));


app.post("/listings/new/", upload.single("image"), (wrapAsync(listingController.NewListingPost)));

app.post("/listings/:id/edit", upload.single("image"), wrapAsync(listingController.editlistingPost));

app.post("/listings/search", (wrapAsync(listingController.searchPost)));

app.post("/listings/:id/delete", isLoggedIn, wrapAsync(listingController.deletelistingPost));

app.post("/signup", wrapAsync(userController.signupPost));

app.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }
),//failureflash will automaticaly impletemetn the failure message and display
    wrapAsync(userController.loginPost));

app.post("/listings/:id", isLoggedIn, wrapAsync(reviewController.reviewPost));

app.post("/listings/:lid/:rid/delete", wrapAsync(reviewController.deleteReviewPost));

app.all("*", (req, res, next) => {
    next(new expressErr(404, "Page not found!"));
}) // kisi bi type ki req kisi bhi url pe aye to ye krna hai

app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong!" } = err;
    res.status(status).render("error.ejs", { err });
    // no path given in app.use means it will work for all paths
})
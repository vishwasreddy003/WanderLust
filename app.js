if(!process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require('path');
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const { cookie } = require("express/lib/response.js");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js"); 
const userRouter = require("./routes/user.js"); 

const MONGO_URL = "mongodb://127.0.0.1:27017/WanderLust";

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret : "mycode",
    resave : false,
    saveUninitialized : true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true, // cross-scripting attacks (security purpose)
    },
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next(); 
});

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewRouter);

app.use("/",userRouter);

// app.get("/", (req, res) => {
//     res.send("HELLO THERE!");
// });

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not Found!"));
});

app.use((err, req, res, next) => {
    let { statuscode = 500, message = "OOPS!" } = err;
    res.status(statuscode).render("error.ejs", { err });

});


app.listen(3033, () => {
    console.log("Listening !");
});
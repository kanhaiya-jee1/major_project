const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./Utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require ("passport-local");
const User = require("./models/user.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public/css")));

//  Expression session

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

app.use(session(sessionOptions));  // middleware
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//  Middleware

app.use((req,res,next)=> {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
})

//  Static method

app.get("/demouser",async(req, res) =>{
    let fakeUser = new User ({
      email: "kanhaiyajee804418@gmail.com",
      Username: "delta-kanhaiyajee",
    });

    let registerdUser = await User.register(fakeUser,"helloword"); // check unique or not
    res.send(registerdUser);
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews); //parent route

//  Error handler  (Middleware)

// Agar koi user koi aise hmare hi domain k kisisi random route k pass request jati h to page nhi hoga (kisi se match nhi hua to hm page not to hm standerd response send krna chate h )
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode, message = "Something went wrong!" } = err;
  res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("server is listining to port 8080");
});


if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./Utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo'); 
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const MONGO_URL = process.env.MONGODB_URI;

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust2";

main()
  .then(() => {
    console.log("connected to app DB");
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

const store = MongoStore.create({
  mongoUrl: MONGO_URL ,
  crypto:{
    secret: process.env.MONGODB_SECRET
  },
  touchAfter: 24 * 3600,
});

store.on("error",() => {
  console.log("ERROR in MONGO SESSION STORE", err);
})


//  Expression session

const sessionOptions = {
  store,
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });


app.use(session(sessionOptions)); // middleware
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//  Middleware

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter); //parent route
app.use("/", userRouter);
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

require("dotenv").config();
// console.log(process.env); // remove this after you've confirmed it is working

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// Route import
const listingRoutes = require("./routes/listingRoute.js");
const reviewRoutes = require("./routes/reviewRoute.js");
const userRoutes = require("./routes/user.js");

// Connect Mongo DB
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(() => {
    console.log("Error connecting to MongoDB");
  });

//Middle wares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Returns middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate); //  // Set 'ejs-mate' as the engine for .ejs files
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "Mysecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session()); // A Web application needs the ability to identify users as they browse from page to page . This series of requests and responses , each assoicated with the same user , is known as a session .
// Passport config
passport.use(new LocalStrategy(User.authenticate())); //Register a strategy for later use when authenticating requests. The name with which the strategy is registered is passed to authenticate().
passport.serializeUser(User.serializeUser()); //Serialize the user object to a JSON string or users into the session
passport.deserializeUser(User.deserializeUser()); //Deserialize the JSON string back to a user object

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;

  next();
});

// password

// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "student@gamilcom",
//     username: "delta-student",
//   });
//   let registerUser = await User.register(fakeUser, "helloworld"); // .register() – For registering a new user and hashing their password.
//   res.send(registerUser);
// });

app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

// Error Handler
// * = all Incoming request
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something Went Wrong" } = err;
  res.status(statusCode).render("./listings/error.ejs", { message });
  // res.status(statusCode).send(message); // coming Proper Error  but Server not Stopping
});
let port = 2004;
app.listen(port, () => {
  console.log("server is running on port ", port);
});

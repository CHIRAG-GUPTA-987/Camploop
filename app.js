if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
require("dotenv").config();

const dbUrl = process.env.DB_URL;
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const joi = require("joi");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./Models/user");
const app = express();
const { isLoggedIn } = require("./middleware");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const favicon = require("serve-favicon");

const expressError = require("./utils/ExpressError");
const userroute = require("./Routes/user");
const camproute = require("./Routes/Campground");
const reviewroute = require("./Routes/Reviews");
const MongoStore = require("connect-mongo");
const secret = process.env.SECRET || "KyaMujhePyaarHaiYaaPehla...";
const store = MongoStore.create({
  mongoUrl: dbUrl,
  secret,
  resave: false,
  touchAfter: 24 * 60 * 60,
});
store.on("error", function (e) {
  console.log("Session Store Error");
});
const sessionSecret = {
  store,
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httponly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7 * 53,
    maxAge: 1000 * 60 * 60 * 24 * 7 * 53,
  },
};

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(session(sessionSecret));
app.use(flash());
app.use(express.static(path.join(__dirname, "./public")));
app.use(passport.initialize());
app.use(passport.session());
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudfare.com/",
  "https://cdn.jsdelivr.net",
];

const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net/",
];

const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];

const fontSrcUrls = [];

// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: [],
//             connectSrc: ["'self'", ...connectSrcUrls],
//             scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//             styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//             workerSrc: ["'self'", "blob:"],
//             objectSrc: [],
//             imgSrc: [
//                 "'self'",
//                 "blob:",
//                 "data:",
//                 `https://res.cloudinary.com/dxgbebpzs/`,
//                 "https://images.unsplash.com"
//             ],
//             fontSrc: ["'self'", ...fontSrcUrls]
//         }
//     })
// )

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", userroute);
app.use("/campground", camproute);
app.use("/campground/:id/review", reviewroute);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new expressError());
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).render("Partials/error", { err });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});

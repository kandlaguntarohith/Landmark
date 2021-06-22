if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/express-error");
const landmarkRouter = require("./routes/landmark");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const MongoStore = require("connect-mongo");
const db_url = process.env.DB_URL;
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());
app.use(mongoSanitize());
const secret = process.env.SECRET || "thisshouldbeabettersecret";
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
//This is the array that needs added to
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
  "https://ipapi.co/",
  // "https://open.spotify.com/",
  // "https://open.scdn.co/",
];
const fontSrcUrls = [
  // "https://open.scdn.co/"
];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/rohithreddy/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        "https://images.unsplash.com/",
        "https://images3.alphacoders.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);
const store = MongoStore.create({
  mongoUrl: db_url,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret,
  },
});
const sessionConfig = {
  store,
  name: "Session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//==========================================================

mongoose.connect(db_url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected !");
});
//==========================================================
app.use((req, res, next) => {
  if (!["/", "/login", "register"].includes(req.originalUrl)) {
    req.session.returnTo = req.originalUrl;
  }
  res.locals.user = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  if (req.originalUrl === "/landmarks") {
    res.locals.showBgMap = 1;
  } else {
    res.locals.showBgMap = 0;
  }
  next();
});
app.get("/", (req, res) => {
  res.render("home.ejs");
});
app.use("/", userRouter);
app.use("/landmarks", landmarkRouter);
app.use("/landmarks/:id/reviews", reviewRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found !!", 404));
});
app.use((error, req, res, next) => {
  const { message = "something went wrong !", statusCode = 500, stack } = error;
  res.status(statusCode).render("errorpage", { message, stack });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server Running on Port : ${port}`);
});

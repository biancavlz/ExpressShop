require("dotenv").config();
const path = require("node:path");

const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongo").default;

const flash = require("connect-flash");

const errorController = require("./controllers/error");
const mongoDBConnect = require("./utils/database").mongoDBConnect;

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const User = require("./models/user");

const bodyParser = require("body-parser");
const { create } = require("node:domain");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoDBStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
  }),
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: req.url,
    path: "/500",
  });
});

mongoDBConnect(() => {
  app.listen(3001);
});

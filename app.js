require("dotenv").config();
const path = require("node:path");

const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const errorController = require("./controllers/error");
const mongoDBConnect = require("./utils/database").mongoDBConnect;

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const User = require("./models/user");

const bodyParser = require("body-parser");
const { create } = require("node:domain");

const app = express();

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  }),
);

app.use((req, res, next) => {
  // req.isLoggedIn = req.session.isLoggedIn;
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

app.use((req, res, next) => {
  // if (!req.session.user) {
  //   return next();
  // }
  // User.findById(req.session.user._id)

  User.findById("6a3e4de333135a8302288e37")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoDBConnect(() => {
  User.findOne().then((user) => {
    if (!user) {
      const user = new User({
        name: "John Doe",
        email: "john.doe@test.com",
        cart: {
          items: [],
        },
      });
      user.save();
    }
  });

  app.listen(3001);
});

require("dotenv").config();
const path = require("node:path");

const express = require("express");
const errorController = require("./controllers/error");
const mongoDBConnect = require("./utils/database").mongoDBConnect;

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const User = require("./models/user");

const bodyParser = require("body-parser");
const { create } = require("node:domain");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("6a3e4de333135a8302288e37")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

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

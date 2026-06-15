const path = require("node:path");

const express = require("express");
const { engine } = require("express-handlebars");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const bodyParser = require("body-parser");

const app = express();

app.engine(
  "hbs",
  engine({
    extname: "hbs",
    layoutsDir: "views/layouts/",
    defaultLayout: "main-layout",
  }),
);

app.set("view engine", "hbs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).render("404", { pageTitle: "Page not found" });
});

app.listen(3001);

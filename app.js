const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use("/", (req, res, next) => {
  res.send("<h1>HOME</h1>");
});

app.listen(3001);

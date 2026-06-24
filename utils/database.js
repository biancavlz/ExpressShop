const mongoose = require("mongoose");

const mongoDBConnect = (callback) => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then((result) => {
      console.log("MongoDB connected");
      callback(result);
    })
    .catch((error) => {
      console.error("MongoDB connection failed:", error);
      process.exit(1);
    });
};

module.exports = mongoDBConnect;

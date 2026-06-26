const mongoose = require("mongoose");

let _db;

const mongoDBConnect = (callback) => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB connected");

      // Correct way to access native db instance (if you still need it)
      _db = mongoose.connection.db;

      if (callback) {
        callback();
      }
    })
    .catch((error) => {
      console.error("MongoDB connection failed:", error);
      process.exit(1);
    });
};

exports.mongoDBConnect = mongoDBConnect;

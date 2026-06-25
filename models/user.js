const mongodb = require("mongodb");

const getDB = require("../utils/database").getDB;

class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  save() {
    const db = getDB();
    db.collection("users").insertOne(this);
  }

  static findById(userId) {
    const db = getDB();

    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(userId) });
  }
}
module.exports = User;

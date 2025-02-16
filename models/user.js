const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportlocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});
userSchema.plugin(passportlocalMongoose); // his plugin simplifies the process of adding user authentication to your application

module.exports = mongoose.model("users", userSchema);

// passport-local-mongoose is a Mongoose plugin that automates the process of setting up local authentication using passport.js.
//It handles common tasks like hashing passwords, validating passwords, and salting.It also provides a simple way to authenticate users using passport.js.

const { default: mongoose } = require("mongoose")
const mongo = require("mongoose")
const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  followers: {
    type: Array,
  },
  following: {
    type: Array,
  },
  phonenumber: {
    type: Number,
    // required: true,
  },
  profilepicture: {
    type: String,
  },
  verifed: {
    type: Boolean,
    required: true,
    default: false,
  },
  joineddate: { type: Date, default: Date.now },
});

module.exports = mongo.model("User", UserSchema)
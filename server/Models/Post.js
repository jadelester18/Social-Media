const { default: mongoose } = require("mongoose");
const mongo = require("mongoose");

const PostSchema = new mongoose.Schema({
  user: {
    type: mongo.Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  video: {
    type: String,
  },
  like: {
    type: Array,
  },
  dislike: {
    type: Array,
  },
  comments: [
    {
      user: {
        type: mongo.Schema.ObjectId,
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongo.model("Post", PostSchema);

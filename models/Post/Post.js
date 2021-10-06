const mongoose = require("mongoose");

//----- Post SCHEMA -----//
const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  video: {
    videoURL: String,
    videoSettings: {
      loop: {
        type: Boolean,
        required: false,
      },
      controls: {
        type: Boolean,
        required: false,
      },
      autoPlay: {
        type: Boolean,
        required: false,
      },
      muted: {
        type: Boolean,
        required: false,
      },
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", PostSchema);

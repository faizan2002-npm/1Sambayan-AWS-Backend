const mongoose = require("mongoose");

//----- Site SCHEMA -----//
const SiteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  phone: {
    type: Number,
    required: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  // video: {
  //   videoURL: String,
  //   videoSettings: {
  //     loop: {
  //       type: Boolean,
  //       required: false
  //     },
  //     controls: {
  //       type: Boolean,
  //       required: false
  //     },
  //     autoPlay: {
  //       type: Boolean,
  //       required: false
  //     },
  //     muted: {
  //       type: Boolean,
  //       required: false
  //     }
  //   },
  // },
  street: { type: String, required: false },
  city: { type: String, required: false },
  zip: { type: String, required: false },
  latitude: { type: Number, required: false },
  longitude: { type: Number, required: false },
  footer: {
    type: String,
  },
  url: {
    type: String,
  },
  slogan: {
    type: String,
  },
  copyright: {
    type: String,
  },
  logo: {
    type: String,
  },
  Facebook: { type: String, required: false },
  Twitter: { type: String, required: false },
  Instagram: { type: String, required: false },
  LinkedIn: { type: String, required: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Site", SiteSchema);

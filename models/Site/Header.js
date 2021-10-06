const mongoose = require("mongoose");

//----- Header SCHEMA -----//
const SiteHeaderSchema = new mongoose.Schema({
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
  backgroundImage: {
    type: String,
    required: false,
  },
  siteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "sites",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SiteHeader", SiteHeaderSchema);

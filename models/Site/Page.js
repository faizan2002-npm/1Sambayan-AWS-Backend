const mongoose = require("mongoose");

//----- Site Page SCHEMA -----//
const SitePageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  section: [
    {
      heading: String,
      button: String,
    },
  ],
  contentBox: {
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

module.exports = mongoose.model("SitePage", SitePageSchema);

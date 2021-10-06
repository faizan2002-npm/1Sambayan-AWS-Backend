const express = require("express");
const router = express.Router();

// Controller Functions //
const accountMethods = require("../../methods/User/account");
const {
  editProfile,
  getProfile,
  updateProfile,
} = require("../../methods/User/profile");
const { protect } = require("../../middlewares/auth");
const upload = require("../../services/multer");
//----- Edit Profile -----//
router.put("/edit-profile", [protect, upload.single("image")], editProfile);

//----- Get Profile -----//
router.get("/profile", protect, getProfile);

module.exports = router;

const express = require("express");
const router = express.Router();

// Controller Functions //
const {
  create,
  update,
  getParties,
  getParty,
  deleteParty,
} = require("../../methods/Party/cud");
const { protect, authorize } = require("../../middlewares/auth");
const upload = require("../../services/multer");

//----- POST -----//
router.get("/", getParty);
router.get("/party-list", getParties);
router.post(
  "/create",
  [protect, authorize("admin"), upload.single("image")],
  create
);
router.put(
  "/update",
  [protect, authorize("admin"), upload.single("image")],
  update
);
router.post("/delete-party", deleteParty);

module.exports = router;

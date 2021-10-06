const express = require("express");
const router = express.Router();

// Controller Functions //
const {
  create,
  update,
  getCandidates,
  getCandidate,
  deleteCandidate,
} = require("../../methods/Candidate/cud");
const { protect, authorize } = require("../../middlewares/auth");
const upload = require("../../services/multer");

//----- POST -----//
router.get("/", getCandidate);
router.get("/candidate-list", getCandidates);
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
router.post("/delete-candidate", deleteCandidate);

module.exports = router;

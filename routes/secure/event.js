const express = require("express");
const router = express.Router();

// Controller Functions //
const {
  create,
  update,
  getEvent,
  getEvents,
  search,
  deleteEvent,
} = require("../../methods/Event/cud");
const { protect, authorize } = require("../../middlewares/auth");
const upload = require("../../services/multer");
const eventUploads = upload.fields([
  {
    name: "video",
    maxCount: 1,
  },
  {
    name: "image",
    maxCount: 1,
  },
]);
//----- EVENT -----//
router.get("/", getEvent);
router.get("/event-list", getEvents);
router.post("/create", [protect, authorize("admin"), eventUploads], create);
router.put("/update", [protect, authorize("admin"), eventUploads], update);
router.put("/search", search);
router.post("/delete-event", deleteEvent);

module.exports = router;

const express = require("express");
const router = express.Router();

// Controller Functions //
const {
  create,
  update,
  getPosts,
  getPost,
  search,
  deletePost,
} = require("../../methods/Post/cud");
const { protect, authorize } = require("../../middlewares/auth");
const upload = require("../../services/multer");
const postUploads = upload.fields([
  {
    name: "image",
    maxCount: 1,
  },
  {
    name: "video",
    maxCount: 1,
  },
]);

//----- POST -----//
router.get("/", getPost);
router.get("/post-list", getPosts);
router.post("/create", [protect, authorize("admin"), postUploads], create);
router.put("/update", [protect, authorize("admin"), postUploads], update);
router.post("/search", search);
router.post("/delete-post", deletePost);

module.exports = router;

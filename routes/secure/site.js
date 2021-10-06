const express = require("express");
const router = express.Router();

// Controller Functions //
const {
  siteMethods,
  siteHeaderMethods,
  sitePageMethods,
} = require("../../methods/Site/cud");
const { create, update, getSite } = siteMethods;
const { protect, authorize } = require("../../middlewares/auth");
const upload = require("../../services/multer");
const siteUploads = upload.fields([
  {
    name: "video",
    maxCount: 1,
  },
  {
    name: "logo",
    maxCount: 1,
  },
]);
const headerUploads = upload.fields([
  {
    name: "image",
    maxCount: 1,
  },
  {
    name: "backgroundImage",
    maxCount: 1,
  },
]);

//----- Site -----//
router.get("/", getSite);
router.post("/create-site", [protect, authorize("admin"), siteUploads], create);
router.put("/update-site", [protect, authorize("admin"), siteUploads], update);

//----- Site Header-----//
router.get("/", siteHeaderMethods.getSiteHeader);
router.get("/header-list", siteHeaderMethods.getSiteHeaders);
router.post(
  "/create-header",
  [protect, authorize("admin"), headerUploads],
  siteHeaderMethods.create
);
router.put(
  "/update-header",
  [protect, authorize("admin"), headerUploads],
  siteHeaderMethods.update
);

//----- Site Pages-----//
router.get("/pages", sitePageMethods.getPages);
router.post(
  "/create-page",
  [protect, authorize("admin")],
  sitePageMethods.create
);
router.put(
  "/update-page",
  [protect, authorize("admin")],
  sitePageMethods.update
);

module.exports = router;

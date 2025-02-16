const express = require("express");
const router = express.Router();

const asyncWrap = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
// controller
const listingController = require("../controller/listing.js");
const multer = require("multer");
const { storage } = require("../cloudinaryConfig.js");
const upload = multer({ storage });
router.get("/root", (req, res) => {
  res.send("Hi ,I am root");
});

router.route("/").get(asyncWrap(listingController.index)).post(
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing, // Joi validation
  asyncWrap(listingController.createListing)
);

// .post(
//   isLoggedIn,
//   upload.single("listing[image]"),
//   validateListing,
//   asyncWrap(listingController.createListing)
// );
// .post(upload.single("listing[image]"), (req, res) => {
//   res.send(req.file);
// });

// // index Route
// router.get("/", asyncWrap(listingController.index));

//New Route
router.get(
  "/new",
  isLoggedIn, // middleware
  asyncWrap(listingController.renderNewRoute)
);

router
  .route("/:id")
  .get(asyncWrap(listingController.ShowListing))
  .put(
    isLoggedIn,
    // validateListing,
    isOwner,
    upload.single("listing[image]"),
    asyncWrap(listingController.UpdateListing)
  )
  .delete(isLoggedIn, isOwner, asyncWrap(listingController.Destory));

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  asyncWrap(listingController.EditListing)
);

module.exports = router;

// Show Route
// router.get("/:id", asyncWrap(listingController.ShowListing));

// // create Route

// router.post("/", validateListing, asyncWrap(listingController.createListing));

// // Update Route
// router.put(
//   "/:id",
//   isLoggedIn,
//   validateListing,
//   isOwner,
//   asyncWrap(listingController.UpdateListing)
// );

// // Delete Route
// router.delete(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   asyncWrap(listingController.Destory)
// );

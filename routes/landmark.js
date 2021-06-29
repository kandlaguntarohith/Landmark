const express = require("express");
const router = express.Router({ mergeParams: true });
const catchError = require("../utils/catch-error");
const { isLoggedIn, validatelandmark, isAuthor } = require("../middleware");
const landmarks = require("../controller/landmark");
const multer = require("multer");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });

router
  .route("/")
  .post(
    isLoggedIn,
    upload.array("image"),
    validatelandmark, //middleware
    catchError(landmarks.postlandmark)
  )
  .get(catchError(landmarks.renderAlllandmarks));
router.get("/new", isLoggedIn, landmarks.renderNewlandmark);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchError(landmarks.renderEditlandmark)
);

router
  .route("/:id")
  .get(catchError(landmarks.renderShowlandmark))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validatelandmark,
    catchError(landmarks.putlandmark)
  )
  .delete(isLoggedIn, isAuthor, catchError(landmarks.deletelandmark));

module.exports = router;

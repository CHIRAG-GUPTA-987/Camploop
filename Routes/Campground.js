const express = require("express");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();
const { isLoggedIn, isAuthor, validateCampGround } = require("../middleware");
const Campground = require("../Controllers/Campground");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

//DISPLAYING ALL CAMPGROUNDS

router.route("/").get(catchAsync(Campground.showAllCampgrounds));

//CREATING NEW CAMPGROUND

router
  .route("/new")
  .get(isLoggedIn, Campground.renderNewForm)
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampGround,
    catchAsync(Campground.createNewCampground)
  );

//DISPLAYING A CAMPGROUND

router.route("/:id").get(catchAsync(Campground.showCampground));

//EDITING A CAMPGROUND

router
  .route("/:id/edit")
  .get(isLoggedIn, isAuthor, catchAsync(Campground.editForm))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampGround,
    catchAsync(Campground.editCampground)
  );

//DELETING A CAMPGROUND

router
  .route("/:id/delete")
  .delete(isLoggedIn, isAuthor, catchAsync(Campground.deleteCampground));

module.exports = router;

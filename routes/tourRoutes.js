const express = require('express');
const tourController = require('./../controllers/tourController');
const authController=require("./../controllers/authController");
const router = express.Router();
const reviewController=require("./../controllers/reviewController");
const reviewRoutes=require("./reviewRoutes");
/* router.param("id",tourController.checkId); */



router
.route("/")
.get(tourController.getAllTours)
.post(/* tourController.checkBody, */authController.protect,authController.restrictTo("admin","lead-guide"),tourController.addTours);

router
.route("/tour-stats")
.get(tourController.getTourStats);

router
.route("/top_5_tours")
.get(tourController.aliasTopTours,tourController.getAllTours);

router
.route("/:id")
.get(tourController.getTours)
.patch(authController.protect,
    authController.restrictTo("admin","lead-guide"),
tourController.uploadTourImages,
tourController.resizeTourImages,
tourController.editTours)
.delete(authController.protect,authController.restrictTo("admin","lead-guide"),tourController.deleteTours);

router.use("/:tourId/reviews",reviewRoutes);

module.exports = router;

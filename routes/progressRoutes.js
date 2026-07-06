const express = require('express');
const progressController=require('../controllers/progressController');
const authController = require('./../controllers/authController');
const router = express.Router();
const mongoose = require('mongoose');

// routes/progressRoutes.js
router.route('/:userId/:courseId')
  .get(authController.protect,
    progressController.getProgress) // პროგრესის წამოღება
  .patch( authController.protect,
    progressController.updateProgress); // ვიდეოს დასრულებულად მონიშვნა

    router.route('/courses/:courseId/coursesProgress') 
      .get(authController.protect,
         progressController.getMyCourseProgress);

    module.exports=router;
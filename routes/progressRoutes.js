const express = require('express');
const progressController=require('../controllers/progressController');
const authController = require('./../controllers/authController');
const router = express.Router();

// routes/progressRoutes.js
router.route('/:userId/:courseId')
  .get(authController.protect,
    progressController.getProgress) // პროგრესის წამოღება
  .patch( authController.protect,
    progressController.updateProgress); // ვიდეოს დასრულებულად მონიშვნა

    module.exports=router;
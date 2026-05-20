const express = require('express');
const videoController = require('./../controllers/videoController');
const authController = require('./../controllers/authController');
const router = express.Router({ mergeParams: true }); // ეს საჭიროა courseId-ს გადასაცემად

// კურსის ვიდეოების მიღება
router.route('/').get(videoController.getAllVideos);

// ვიდეო დამატება (მხოლოდ მენეჯერი)
router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('manager'),
    videoController.setCourseId,
    videoController.addVideo
  );

// კონკრეტული ვიდეოს მიღება
router.route('/:id').get(videoController.getVideo);

// ვიდეო განახლება (მხოლოდ მენეჯერი)
router
  .route('/:id')
  .patch(
    authController.protect,
    authController.restrictTo('manager'),
    videoController.updateVideo
  );

// ვიდეო წაშლა (მხოლოდ მენეჯერი)
router
  .route('/:id')
  .delete(
    authController.protect,
    authController.restrictTo('manager'),
    videoController.deleteVideo
  );

module.exports = router;

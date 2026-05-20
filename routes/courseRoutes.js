const express = require('express');
const courseController = require('./../controllers/courseController');
const authController = require('./../controllers/authController');
const videoRouter = require('./videoRoutes');
const router = express.Router();

// ვიდეოების რუტი კურსის ქვეშ
router.use('/:courseId/videos', videoRouter);

router.route('/addCourse').post(
  authController.protect, // 1. ჯერ შეამოწმე სისტემაშია თუ არა
  authController.restrictTo('manager'), // 2. მერე შეამოწმე მენეჯერია თუ არა
  courseController.setInstructorId,
  courseController.createCourse
);

// ყველა კურსის მიღება
router.route('/').get(courseController.getAllCourses);

// კონკრეტული კურსის მიღება ვიდეოებით
router.route('/:id').get(courseController.getCourseWithVideos);

// კურსის განახლება (მხოლოდ მენეჯერი)
router
  .route('/:id')
  .patch(
    authController.protect,
    authController.restrictTo('manager'),
    courseController.updateCourse
  );

// კურსის წაშლა (მხოლოდ მენეჯერი)
router
  .route('/:id')
  .delete(
    authController.protect,
    authController.restrictTo('manager'),
    courseController.deleteCourse
  );

module.exports = router;

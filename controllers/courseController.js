const Course = require('./../models/courseModel');
const Video = require('./../models/videoModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');

// ეს არის შუამავალი ფუნქცია, რომელიც req.body-ს ამზადებს ფაქტორიისთვის
exports.setInstructorId = (req, res, next) => {
  if (!req.body.instructor) req.body.instructor = req.user.id;
  next(); // აუცილებელია, რომ გადავიდეს შემდეგ ფუნქციაზე!
};

// აქ ვიყენებთ შენს დაწერილ მაგარ ფუნქციას
exports.createCourse = factory.addOne(Course);

// კურსის მიღება მისი ვიდეოებით
exports.getCourseWithVideos = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new appError('Course not found', 404));
  }

  // ამ კურსის ყველა ვიდეოს მიღება
  const videos = await Video.find({ course: course._id });

  res.status(200).json({
    status: 'success',
    data: {
      course,
      videos
    }
  });
});

// ყველა კურსის მიღება
exports.getAllCourses = factory.getAll(Course);

// კურსის განახლება
exports.updateCourse = factory.editOne(Course);

// კურსის წაშლა
exports.deleteCourse = factory.deleteOne(Course);

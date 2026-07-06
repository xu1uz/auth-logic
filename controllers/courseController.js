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

exports.getCourse = catchAsync(async (req, res, next) => {
  const { id: courseId } = req.params; // ვივარაუდოთ, რომ რუთში 'id' გაქვს
  const userId = req.user.id;          // იუზერი, რომელიც ლოგინშია

  // 1. კურსის წამოღება
  const course = await Course.findById(courseId);
  if (!course) {
    return next(new AppError('კურსი ვერ მოიძებნა', 404));
  }

  // 2. პროგრესის აგრეგაცია (სტატისტიკის გამოთვლა)
  const stats = await Progress.aggregate([
    { $match: { user: userId, course: courseId } },
    { $unwind: "$videoProgress" },
    {
      $group: {
        _id: "$course",
        totalVideos: { $sum: 1 },
        completedVideos: { 
          $sum: { $cond: ["$videoProgress.isCompleted", 1, 0] } 
        }
      }
    },
    {
      $project: {
        totalVideos: 1,
        completedVideos: 1,
        percentage: { 
          $multiply: [{ $divide: ["$completedVideos", "$totalVideos"] }, 100] 
        }
      }
    }
  ]);

  // 3. შედეგის აწყობა
  // თუ course.toObject()-ს გამოიყენებ, უფრო უსაფრთხოა ვიდრე ._doc
  const courseObj = course.toObject ? course.toObject() : course;
  
  const result = {
    ...courseObj,
    progressPercentage: stats.length > 0 ? Math.round(stats[0].percentage) : 0
  };

  res.status(200).json({
    status: 'success',
    data: result
  });
});
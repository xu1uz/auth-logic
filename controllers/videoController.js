const Video = require('./../models/videoModel');
const Course = require('./../models/courseModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');

// ვიდეო დამატებამდე კურსის ID-ს დავამატებთ
exports.setCourseId = (req, res, next) => {
  if (!req.body.course) req.body.course = req.params.courseId;
  next();
};

// ვიდეო შექმნა (factory)
exports.addVideo = factory.addOne(Video);

// კონკრეტული ვიდეო მიღება
exports.getVideo = factory.getOne(Video);

// ვიდეო განახლება
exports.updateVideo = factory.editOne(Video);

// ვიდეო წაშლა
exports.deleteVideo = factory.deleteOne(Video);

// ყველა ვიდეო მიღება კურსის მიხედვით
exports.getAllVideos = catchAsync(async (req, res, next) => {
  const courseId = req.params.courseId;

  // კურსის არსებობის შემოწმება
  const course = await Course.findById(courseId);
  if (!course) {
    return next(new appError('Course not found', 404));
  }

  // ყველა ვიდეოს პოვნა ამ კურსისთვის
  const videos = await Video.find({ course: courseId });

  res.status(200).json({
    status: 'success',
    data: {
      videos
    }
  });
});

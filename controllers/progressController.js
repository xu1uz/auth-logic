const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const Progress = require('../models/progresModel');



exports.updateProgress = catchAsync(async (req, res, next) => {
  const { userId, courseId } = req.params;
  const { videoId, isCompleted } = req.body;

  // 1. ვცდილობთ ვიპოვოთ
  let progress = await Progress.findOne({ user: userId, course: courseId });

  // 2. თუ არ არსებობს, ვქმნით
  if (!progress) {
    progress = await Progress.create({
      user: userId,
      course: courseId,
      videoProgress: [{ video: videoId, isCompleted }]
    });
  } else {
    // 3. თუ არსებობს, ვანახლებთ
    progress = await Progress.findOneAndUpdate(
      { user: userId, course: courseId, "videoProgress.video": videoId },
      { $set: { "videoProgress.$.isCompleted": isCompleted } },
      { new: true }
    );
    
    // თუ ვიდეო მასივში ჯერ არ არის, მაშინ უბრალოდ ვუმატებთ
    if (!progress) {
      progress = await Progress.findByIdAndUpdate(
        progress._id,
        { $push: { videoProgress: { video: videoId, isCompleted } } },
        { new: true }
      );
    }
  }

  res.status(200).json({ status: 'success', data: progress });
});

exports.getProgress = catchAsync(async (req, res, next) => {
  // რადგან რუთია /:userId/:courseId, პარამეტრები ასე უნდა აიღო:
  const { userId, courseId } = req.params;

  const doc = await Progress.findOne({ 
    user: userId, 
    course: courseId 
  }).populate('course'); // თუ გინდა დაპოპულება

  if (!doc) {
    return next(new AppError(`No progress found for User`, 404));
  }

  res.status(200).json({ status: 'success', data: { doc } });
});
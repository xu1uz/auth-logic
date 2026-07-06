const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const Progress = require('../models/progresModel');

exports.updateProgress = catchAsync(async (req, res, next) => {
  console.log("REQ.BODY:", req.body);
  const { userId, courseId } = req.params;
  const { videoId, isCompleted, progress } = req.body;

  let doc = await Progress.findOne({ user: userId, course: courseId });

  if (!doc) {
    doc = await Progress.create({
      user: userId,
      course: courseId,
      videoProgress: [{ video: videoId, isCompleted, progress }]
    });
  } else {
    // 1. განახლება returnDocument: 'after'-ით
    const updated = await Progress.findOneAndUpdate(
      { _id: doc._id, "videoProgress.video": videoId },
      { 
        $set: { 
          "videoProgress.$.isCompleted": isCompleted,
          "videoProgress.$.progress": progress 
        } 
      },
      { returnDocument: 'after' } // აქ შევცვალეთ
    );

    if (!updated) {
      doc = await Progress.findByIdAndUpdate(
        doc._id,
        { $push: { videoProgress: { video: videoId, isCompleted, progress } } },
        { returnDocument: 'after' } // აქაც შევცვალეთ
      );
    } else {
      doc = updated;
    }
  }

  res.status(200).json({ status: 'success', data: doc });
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
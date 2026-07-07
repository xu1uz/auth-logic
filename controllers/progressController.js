const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const Progress = require('../models/progresModel');
const mongoose = require('mongoose');
const Course = require('../models/courseModel');
const Video=require('../models/videoModel');
const User=require('../models/userModel');

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







exports.getMyCourseProgress = catchAsync(async (req, res, next) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  // 1. მოგვაქვს ყველა ვიდეო ამ კურსისთვის
  const allVideos = await Video.find({ course: courseId });

  // 2. მოგვაქვს იუზერის პროგრესი
  const userProgress = await Progress.findOne({ user: userId, course: courseId });
  const watchedVideos = userProgress ? userProgress.videoProgress : [];

  // 3. ვაერთიანებთ მონაცემებს
  const result = allVideos.map(video => {
    const progressData = watchedVideos.find(
      (vp) => vp.video.toString() === video._id.toString()
    );

    return {
      videoId: video._id,
      title: video.title,
      isCompleted: progressData ? progressData.isCompleted : false,
      progress: progressData ? progressData.progress : 0 // პროგრესი პროცენტებში (0-100)
    };
  });

  // 4. სტატისტიკის დათვლა
  const totalVideos = allVideos.length;
  
  // ჯამდება თითოეული ვიდეოს პროგრესი
  const totalProgressSum = result.reduce((sum, v) => sum + (v.progress || 0), 0);
  
  // კურსის საერთო პროცენტი არის ჯამური პროგრესი გაყოფილი ვიდეოების რაოდენობაზე
  const percentage = totalVideos > 0 ? (totalProgressSum / totalVideos) : 0;

  res.status(200).json({
    status: 'success',
    data: {
      totalVideos,
      percentage: Math.round(percentage), // აბრუნებს 0-100-ს შორის
      videos: result
    }
  });
});




exports.getAllEnrolledCoursesProgress = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  // 1. მოვიტანოთ იუზერი თავისი დარეგისტრირებული კურსებით
  const user = await User.findById(userId).populate('enrolledCourses');
  
  if (!user || !user.enrolledCourses) {
    return res.status(200).json({ status: 'success', data: [] });
  }

  // 2. თითოეული კურსისთვის პარალელურად დავთვალოთ პროგრესი
  const coursesProgress = await Promise.all(
    user.enrolledCourses.map(async (course) => {
      // ვიღებთ ყველა ვიდეოს ამ კურსისთვის
      const allVideos = await Video.find({ course: course._id });
      
      // ვიღებთ იუზერის პროგრესს ამ კურსისთვის
      const userProgress = await Progress.findOne({ user: userId, course: course._id });
      const watchedVideos = userProgress ? userProgress.videoProgress : [];

      // ვითვლით პროცენტს (ჯამური პროგრესის საშუალო)
      const totalVideos = allVideos.length;
      const totalProgressSum = allVideos.reduce((sum, video) => {
        const progressData = watchedVideos.find(
          (vp) => vp.video.toString() === video._id.toString()
        );
        return sum + (progressData ? progressData.progress : 0);
      }, 0);

      const percentage = totalVideos > 0 ? Math.round(totalProgressSum / totalVideos) : 0;

      return {
        courseId: course._id,
        courseName: course.name, // ან რა ველსაც იყენებ სახელისთვის
        percentage: percentage
      };
    })
  );

  res.status(200).json({
    status: 'success',
    user:user.id,
    data: coursesProgress
  });
});
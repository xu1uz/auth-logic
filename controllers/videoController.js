const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Video = require('./../models/videoModel');
const Course = require('./../models/courseModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');

const videosDir = path.join(__dirname, '..', 'public', 'videos');
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, videosDir);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(
      null,
      `video-${req.user ? req.user.id : 'anonymous'}-${Date.now()}.${ext}`
    );
  }
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video')) {
    cb(null, true);
  } else {
    cb(
      new appError('Not a video file! Please upload only videos.', 400),
      false
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 1024 * 1024 * 500 }
});

exports.uploadVideoFile = upload.single('video');

// ვიდეო დამატებამდე კურსის ID-ს დავამატებთ
exports.setCourseId = (req, res, next) => {
  if (!req.body.course) req.body.course = req.params.courseId;
  next();
};




exports.addVideo = catchAsync(async (req, res, next) => {
  // 1. თუ ფაილია ატვირთული, ვიღებთ ფაილის სახელს
  if (req.file) {
    req.body.videoFile = req.file.filename;
  } 
  // 2. თუ ფაილი არ არის, მაგრამ მოვიდა იუთუბის ლინკი (req.body.videoFile)
  // მაშინ არაფერს ვცვლით, რადგან req.body.videoFile უკვე გამოგზავნილია ფრონტიდან
  else if (req.body.videoFile) {
    // აქ ვტოვებთ როგორც არის
  } 
  // 3. თუ არც ფაილია და არც ლინკი, ვაბრუნებთ შეცდომას
  else {
    return next(new appError('Please upload a video file or provide a video link.', 400));
  }

  const doc = await Video.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { doc }
  });
});

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

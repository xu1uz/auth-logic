const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'video must have a title']
  },
  videoFile: {
    type: String,
    required: [true, 'video must have a file name']
  },
  duration: {
    type: Number // მინიტებში
  },
  description: {
    type: String
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: [true, 'video must belong to a course']
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

// ვიდეო ძებნისას კურსი გამოჩნდება
videoSchema.pre(/^find/, function() {
  this.populate({
    path: 'course',
    select: 'title'
  });
});

const Video = mongoose.model('Video', videoSchema);
module.exports = Video;

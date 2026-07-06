const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
     type: mongoose.Schema.ObjectId,
      ref: 'User',
       required: true },
  course: {
     type: mongoose.Schema.ObjectId,
      ref: 'Course',
       required: true },
  videoProgress: [
    {
      video: {
         type: mongoose.Schema.ObjectId,
          ref: 'Video' },
      isCompleted: {
         type: Boolean,
          default: false },
          progress:{
            type: Number,
            default: 0
          },
      watchedAt: {
         type: Date,
          default: Date.now }
    }
  ]
});
const Progress = mongoose.model('Progress', progressSchema);
module.exports=Progress;
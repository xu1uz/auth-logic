const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'course must have a title']
  },
  description: {
    type: String,
    required: [true, 'course must have a description']
  },
  price: {
    type: Number,
    required: [true, 'course must have a price']
  },
  instructor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Course must belong to an instructor (manager)']
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

// კურსის ძებნისას ინსტრუქტორი და ვიდეოები გამოჩნდება
courseSchema.pre(/^find/, function() {
  this.populate({
    path: 'instructor',
    select: 'name email'
  });
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;

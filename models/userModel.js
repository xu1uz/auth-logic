const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: [7, 'username must be more than 7']
  },
  email: {
    type: String,
    required: [true, 'enter email!!'],
    unique: [true, 'email must be unicue'],
    trim: true,
    validate: [validator.isEmail, 'enter valid email!!!']
  },
  photo: {
    type: String,
    default:"default.jpg"
  },
  uphoto:{
    type: String,
    default:"https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
  },
  role: {
    type: String,
    enum: ['user', 'manager'],
    default: 'user'
  },
  password: {
    type: String,
    required: true,
    minLength: [8, 'password must be more than 8'],
    select: false
  },
  confirmPassword: {
    type: String,
    required: true,
    minLength: [8, 'password must be more than 8'],
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'passwords are not same!!'
    }
  },
  enrolledCourses: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Course' 
    }
  ],
  passwordChangedAt: Date,
  passwordResetToken:String,
  passwordResetExpires:Date,
  isActive:{
    type:Boolean,
    default:true,
    select:false
  }
});

userSchema.pre("save", async function() {

  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;

  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000;
  }

  
});

userSchema.pre(/^find/,async function(){
  this.find({isActive:true});
})

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;

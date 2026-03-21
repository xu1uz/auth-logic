const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const appError = require('./../utils/appError');
const sendEmail = require('./../utils/email');
const { promisify } = require('util');
const crypto = require('crypto');
const Email=require("./../utils/email");


const getToken = ids => {
  return jwt.sign({ id: ids }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
}



const createSendToken=(user,statusCode,res)=>{
  const token = getToken(user._id);

  const cookieOptions={
    expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000),
    httpOnly:true
  }
  if(process.env.NODE_ENV==="production") cookieOptions.secure=true;

  res.cookie("jwt",token,cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    statuss: 'success',
    token,
    data:{
      user:user
    }
  })};



  exports.signup = catchAsync(async (req, res, next) => {
  
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    role: req.body.role
  });
  const url=`${req.protocol}://${req.get("host")}/me`;
  await new Email(newUser,url).sendWelcome();

  createSendToken(newUser,201,res);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
  });


exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // if email and password exists
  if (!email || !password) {
    next(new appError('pleace provide email and password!!', 400));
  }

  // if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    next(new appError('incorrect email or password', 401));
  }
  console.log(user);

  const token = getToken(user._id);
  res.status(200).json({
    statuss: 'success',
    token
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //get token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  console.log(token);

  if (!token) {
    return next(new appError('you are not logged in! pleace log in', 401));
  }
  //validate token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);
  //check user still exists

  const fUser = await User.findById(decoded.id);
  if (!fUser) {
    return next(
      new appError('the user belonging to this token does not exists', 401)
    );
  }
  //check if user changed password after  the token was issued
  if (fUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new appError('user recently changed password! pleace login again', 401)
    );
  }

  req.user = fUser;
  console.log(fUser);

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new appError('you do not have permision to do this!!', 403));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new appError('there is no user with this email adress'), 404);
  }

  const ResetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${ResetToken}`;

  const message = `forgot your password? submit patch request with your new password and confirm it to :${resetURL} `;

  try {
    /* await sendEmail({
      email: user.email,
      subject: 'your password reset token(invalid for 10 min)',
      message
    }); */
    await new Email(user,resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'token sent to email'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new appError('there is problem to send email. try again later!!', 500)
    );
  }
});
//reset password
exports.resetPassword =catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

const user=await User.findOne({passwordResetToken:hashedToken,passwordResetExpires:{$gt:Date.now()}});

if(!user){
    return next(new appError("invalid token or it has expired",400))
}

user.password=req.body.password;
user.confirmPassword=req.body.confirmPassword;
user.passwordResetToken=undefined;
user.passwordResetExpires=undefined;
await user.save();

 const token = getToken(user._id);
  res.status(200).json({
    statuss: 'success',
    token
  });

});




exports.updatePassword=catchAsync(async(req,res,next)=>{
 const user=await User.findById(req.user.id).select("+password");


 if(!(await user.correctPassword(req.body.currentPassword,user.password))){
    return next(new appError("your current password is wrong",401))
 }


 user.password=req.body.password;
 user.confirmPassword=req.body.confirmPassword;
 await user.save();


createSendToken(user,200,res);



})


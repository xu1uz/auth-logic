const AppError = require('../utils/appError');

let handleCastErrorDB = err => {
  const message = `invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {

 const keyValue = err.keyValue || err.cause?.keyValue;

 const field = Object.keys(keyValue)[0];
 const value = keyValue[field];

 return new AppError(
   `Duplicate field value: ${value}. Please use another value`,
   400
 );
};

let handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `invalid input data ${errors.join('.  ')}`;
  return new AppError(message, 400);
};

let handleJWTError = err =>
  new AppError('invalid token pleace log in again', 401);

let handleTokenExpiredError = err =>
  new AppError('token time expired!! log in again', 401);

let fordev = (err, res) => {
  console.log('ERROR MESSAGE:', err.message);
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    message: err.message,
    stack: err.stack
  });
};
let forprod = (err, res) => {
console.dir(err,{depth:null});
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
  ///unknown error
  else {
    res.status(500).json({
      status: 'error!!!',
      message: 'someting went very wrong!!!'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    fordev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = err;   
 
     if (error.name === 'CastError') error = handleCastErrorDB(error);
     if (error.kind === 'ObjectId') error = handleCastErrorDB(err);
     if(error.code === 11000 || error.cause?.code === 11000)error=handleDuplicateFieldsDB(error);
     if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
     if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
     if (error.name === 'TokenExpiredError')
      error = handleTokenExpiredError(error);
    forprod(error, res);
  }
};

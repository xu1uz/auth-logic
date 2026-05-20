/*const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});
*/

/*
// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;


*/
const express = require('express');

//start express app
const app = express();
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const fs = require('fs');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const courseRouter = require('./routes/courseRoutes');
const videoRouter = require('./routes/videoRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');

app.use(helmet());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'too many requests, pleace try again leiter'
});
app.use('/api', limiter);

app.use(express.json());

//data sanitization nosql query injection

app.use(mongoSanitize());

//data sanitization xss
app.use(xss());
//pparameter pollution
app.use(
  hpp({
    whitelist: ['duration']
  })
);

app.use(express.static(`${__dirname}/public`));

/* app.use((req,res,next)=>{
  req.reqTime=new Date().toISOString();
  console.log("hello from midleware")
  req.reqTime=new Date().toISOString();
  console.log("hello from midleware")
  next();
})

 */

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v2/courses', courseRouter);
app.use('/api/v2/videos', videoRouter);

/* app.getAllTours("/api/v1/tours",getAllTours);
app.post("/api/v1/tours",addTours);
app.get("/api/v1/tours/:id",getTours);
app.patch("/api/v1/tours/:id",editTours);
app.delete("/api/v1/tours/:id", deleteTours ); */

//swagger main / route
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);

app.all('*', (req, res, next) => {
  /*  res.status(404)
  .json({
    status: "fail",
    message:`cant find ${req.originalUrl} on this server!!`
  }) */

  next(new AppError(`cant find ${req.originalUrl} on this server!!`, 404));

  /*  const err=new Error(`cant find ${req.originalUrl} on this server!!`);
  err.status="fail";
  err.statusCode=404;
  next(err); */
});

app.use(globalErrorHandler);

module.exports = app;

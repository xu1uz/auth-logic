const Review=require("./../models/reviewModel");
const ReqSort = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError=require("./../utils/appError");
const factory=require("./handlerFactory");

exports.getReviews=catchAsync(async(req,res,next)=>{
    let filter={};
    if(req.params.tourId)filter={tours:req.params.tourId};
const review=await Review.find(filter);
if (review.length === 0) {
    return next(new AppError("There are no reviews", 401));
}

res.status(200)
.json({
    status:"success",
    data:{
        review
    }
})

})



exports.setTourAndUser=(req,res,next)=>{
       if(!req.body.tours)req.body.tours=req.params.tourId;
    if(!req.body.users)req.body.users=req.user;
    next();
}

/* exports.addReviews=catchAsync(async(req,res,next)=>{
    if(!req.body.tours)req.body.tours=req.params.tourId;
    if(!req.body.users)req.body.users=req.user;

const newReview=await Review.create(req.body);

res.status(200)
.json({
    status:"success",
    data:{
       review:newReview
    }
})

}) */


exports.addReviews=factory.addOne(Review);
exports.deleteTours=factory.deleteOne(Review);
exports.editTours=factory.editOne(Review);

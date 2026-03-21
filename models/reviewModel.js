const mongoose=require("mongoose");
const slugify=require("slugify");
const validator=require("validator");
const User = require("./userModel");
const Tour = require("./tourModel");


const reviewSchema= new mongoose.Schema({

review:{
    type:String,
    required:[true,"review can not empty!!"]
},
rating:{
    type:Number,
    min:1,
    max:5
},
createdAt:{
    type:Date,
    default:Date.now(),
    select:false
},
users:
    {
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
tours:
    {
        type:mongoose.Schema.ObjectId,
        ref:"Tour"
    }
})

reviewSchema.pre(/^find/,function(){
    this.populate({
        path:"users"
    })
})


const Review=mongoose.model("Review",reviewSchema);
module.exports=Review;
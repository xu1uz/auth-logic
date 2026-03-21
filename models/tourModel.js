const mongoose=require("mongoose");
const slugify=require("slugify");
const validator=require("validator");
const User = require("./userModel");

const tourschema= new mongoose.Schema({
  name:{
    type: String,
    required: [true,"a tour must have a name"],
    unique:true,
    trim:true,
    maxLength:[40,"a tour must have lett then 40 characters"],
    minLength:[10,"a tour must have lett then 10 characters"]/* ,
    validate:[validator.isAlpha,"name must only contain characters"] */
  },
  duration:{
    type:Number,
    required:[true,"a tour must have duration"]
  },
  maxGroupSize:{
    type:Number,
    required:[true,"tour must have a max size"]
  },
  difficulty:{
    type:String,
    required:[true,"a tour must have a difficulty"],
    enum:{
      values:["easy","medium","difficult"],
      message:"easy medium or difficulty"
  }},
  ratingAverage:{
    type:Number,
    default: 4.5,
    max:[5],
    min:[2]
  },
  ratingQuantity:{
    type:Number,
    default:0
  },
  priceDiscount: Number,
  summary:{
    type:String,
    trim:true,
    required:[true,"a tour must have a descruption"]
  },
  description:{
    type:String,
    trim:true
  },
  imageCover:{
    type:String,
    required:[true,"tour must have a image"]
  },
  images:{
    type:[String]
  },
  createdAt:{
    type:Date,
    default:Date.now(),
    select:false
  },
  startDates:{
    type:[Date]
  },
  slug:{
    type:String
  },
  price:{
    type:Number,
    required:[true,"a tour must have a price"]
  },
  priceDiscount:{
type:Number,
validate:function(val){
  return val<this.price;
}
  },
secretTour:{
 type: Boolean,
 default:false 
},
startLocation:{
  type:{
    type:String,
    default:"Point",
    enum:["Point"]
  },
  coordinates:[Number],
  adress:String,
  description:String
},
locations:[
{
  type:{
    type:String,
    default:"Point",
    enum:["Point"]
  },
  coordinates:[Number],
  adress:String,
  description:String,
  day:Number
}

],
guides:[
  {
    type:mongoose.Schema.ObjectId,
    ref:"User"
  }
]
},
   {
    toJSON:{virtuals:true},
    toObject:{virtuals:true}

  }
);


tourschema.index({price:1});


tourschema.virtual("reviews",{
  ref:"Review",
  foreignField:"tours",
  localField:"_id"
});

//virtual properties
tourschema.virtual("price-peer-day").get(function(){
  return this.price/this.duration;
})

//document middleware

//pre
tourschema.pre("save",function(){
  this.slug=slugify(this.name,{lower:true});

});


//tourschema.pre("save",async function(){
 // const guidesPromises=this.guides.map(async id=>await User.findById(id));
  //this.guides=await Promise.all(guidesPromises);
//});

//post
tourschema.post("save",function(doc){
  console.log(doc);
})

//query middleware
//pre

tourschema.pre(/^find/,function(){
  this.find({secretTour:{$ne:true}});
})


//agregaion midleware 
tourschema.pre("aggregate", function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour=mongoose.model("Tour",tourschema);

module.exports=Tour;



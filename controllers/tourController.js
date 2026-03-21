const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const factory=require("./handlerFactory");
const AppError=require("./../utils/appError");
const multer = require('multer');
const sharp = require('sharp');
/* exports.checkId = (req, res, next, val) => {
  console.log("ID is " + val);

  const id = val * 1;  // პირდაპირ პარამეტრიდან
  const tour = tours.find(t => t.id === id);

  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Tour not found"
    });
  }

  next();
} */


const multerStorage=multer.memoryStorage();


const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('not an image!!! pleace upload images.'));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadTourImages=upload.fields([
  {name:"imageCover",maxCount:1},
  {name:"images",maxCount:3}
]);
upload.single("image");
upload.array("images",5);

exports.resizeTourImages=catchAsync(async(req,res,next)=>{
  console.log(req.files);
  if(!req.files.imageCover || !req.files.images)return next();
  const imageCoverFileName=`tour-${req.params.id}-${Date.now()}-over.jpeg`;
  await sharp(req.file.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/tours/${imageCoverFileName}`); 
      req.body.imageCover=imageCoverFileName;   
  next();
});

exports.aliasTopTours = (req, res, next) => {
  (req.query.limit = '5'),
    (req.query.sort = '-price'),
    (req.query.fields = 'name,price,ratingsAverage');
  next();
};

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { price: { $gte: 400 } }
    },
    {
      $group: {
        _id: '$difficulty',
        minPrice: { $min: '$price' }
      }
    }
  ]);

  res.status(200).json({
    status: 'success!!!',
    results: stats.length,
    data: {
      stats: stats
    }
  });
});

/* exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new ReqSort(Tour.find(), req.query)
    .filter()
    .sort()
    .limitedFields()
    .pagination();
    

  //query gashveba

  const allTours = await features.query;
  res.status(200).json({
    status: 'success!!',

    data: {
      tours: allTours
    }
  });
}); */

exports.getAllTours=factory.getAll(Tour);
/* 
exports.addTours = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour
    }
  });
}); */



/* const newId=tours[tours.length-1].id+1;
const newTour=Object.assign({id:newId},req.body);
tours.push(newTour);
res.send("done!!!");
fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours)),err=>{

  console.log("file not writed!!!");
} */
/* 
exports.getTours =catchAsync(async (req, res,next) => {
  
    const oneTour = await Tour.findById(req.params.id).populate("reviews");
    if(!oneTour){
     return  next(new AppError(`tour not find with ID- ${req.params.id}`,404 ));
    }

    res.status(200).json({
      data: {
        tour: oneTour
      }
    });
  
  }
); */
exports.addTours=factory.addOne(Tour);

 exports.getTours = factory.getOne(Tour, {
  path: "reviews"
});

exports.deleteTours=factory.deleteOne(Tour);
exports.editTours=factory.editOne(Tour);
/*
exports.editTours =catchAsync(async (req, res, next) => {
    let updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true
    });

    res.status(200).json({
      status: 'success!!!',
      data: {
        tour: updatedTour
      }
    });
  
}); */





/*
 exports.deleteTours = async (req, res) => {
  try {
    let deleteTour = await Tour.findByIdAndDelete(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true
    });

     const index = tours.findIndex(el => el.id === id);

  tours.splice(index, 1); 

    res.status(200).json({
      status: 'success',
      message: 'Tour deleted successfully!'
    });
  } catch (err) {
    res.status(404).json({
      status: 'tour not deleted!!'
    });
  }
}; 
*/
/* exports.checkBody=(req,res,next)=>{
  if(!req.body.name || !req.body.price){
    return res.status(400)
    .json({
      status:"fail!!"
    })
  }
} */

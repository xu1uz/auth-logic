const catchAsync=require("./../utils/catchAsync");
const AppError=require("./../utils/appError");
const ReqSort = require('./../utils/apiFeatures');


//delete
exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({ status: 'success', data: null });
  });



  //get

  exports.getOne = (Model,popOptions) =>catchAsync(async (req, res,next) => {
    let query=Model.findById(req.params.id);
    if(popOptions)  query=query.populate(popOptions);
      const doc = await query;
      if(!doc){
       return  next(new AppError(`not find with ID- ${req.params.id}`,404 ));
      }
  
      res.status(200).json({
        data: doc
        
      });
    
    }
  );


  //update
  exports.editOne=Model =>catchAsync(async (req, res, next) => {
      let doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        returnDocument: 'after',
        runValidators: true
      });
  
       if(!doc){
       return  next(new AppError(` not find with ID- ${req.params.id}`,404 ));
      }
      res.status(200).json({
        status: 'success!!!',
        data: {
          doc
        }
      });
    
  });


  //add

  exports.addOne = Model=>catchAsync(async (req, res, next) => {
  const doc = await Model.create(req.body);
  if(!doc){
       return  next(new AppError(` not find with ID- ${req.params.id}`,404 ));
      }

  res.status(201).json({
    status: 'success',
    data: {
      doc
    }
  });
});

//get all

exports.getAll =Model=> catchAsync(async (req, res, next) => {
  let filter={};
    if(req.params.tourId)filter={tours:req.params.tourId};
  const features = new ReqSort(Model.find(filter), req.query)
    .filter()
    .sort()
    .limitedFields()
    .pagination();
    

  //query gashveba

  const doc = await features.query;
  res.status(200).json({
    status: 'success!!',

    data: {
      doc
    }
  });
});
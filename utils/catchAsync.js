module.exports=asf=>{
  return (req,res,next)=>{
  asf(req,res,next).catch(next);
 }
}

//catchAsync
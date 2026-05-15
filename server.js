const mongoose=require("mongoose");
const dotenv=require("dotenv");
const dns=require("node:dns")


dns.setServers([
  '1.1.1.1',
  '1.0.0.1',
  '8.8.8.8',
]);

/* process.on("uncaughtException",err=>{
  console.log(err.name,err.message);
    process.exit(1);
  
}) */
dotenv.config({path:"./config.env"});
const app=require("./app");



const DB=process.env.DATABASE.replace("<PASSWORD>",process.env.DATABASE_PASSWORD);
mongoose
.connect(DB)
.then(()=>{
  console.log("DB conected successful!!!");
})
.catch(err=>{
  console.log("DB not connected!! "+err);
});







const port=process.env.PORT;
const server=app.listen(port,()=>{
  console.log("app started on port  "+port);
});


process.on("unhandledRejection",err=>{
  console.log(err.name,err.message);

  server.close(()=>{
      process.exit(1);
  })
})
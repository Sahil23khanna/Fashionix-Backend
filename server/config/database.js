const mongoose = require("mongoose")
console.log("ENV CHECK:", process.env.MONGO_URL);
mongoose.connect(process.env.MONGO_URL)         /* "mongodb://localhost:27017/NewCommerce" */

.then(()=>{
  console.log("Database is Connected");
})

.catch((error)=>{
  console.log(error);
})
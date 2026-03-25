const mongoose = require("mongoose")

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 50000, 
    socketTimeoutMS: 60000 
})         

.then(()=>{
  console.log("Database is Connected");
})

.catch((error)=>{
  console.log(error);
})
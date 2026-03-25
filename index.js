const express = require("express")
const cors = require("cors")
const app = express()
require('dotenv').config()

app.use(express.urlencoded({extended:true}))
app.use(express.json({limit:"40mb"}))
app.use(cors())

const api = require("./server/routes/apiRoutes")
app.use("/api",api)

const admin = require("./server/routes/adminRoutes")
app.use("/admin",admin)

const customer = require("./server/routes/customerRoutes")
app.use("/customer",customer)

const database = require("./server/config/database")
const seeding = require("./server/config/seeding")

app.listen(process.env.PORT,()=>{
    console.log("Sever is running at port",process.env.PORT);
})

app.get("/",(req,res)=>{
    res.json({
        status:200,
        success:true,
        message:"api is working"
    })
})

/* const path = require("path");

app.use(express.static(path.join(__dirname, "dist")));
 */
 /*app.get(/.*//* , */ /* (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});  */
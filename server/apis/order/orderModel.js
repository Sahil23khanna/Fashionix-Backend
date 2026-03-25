const mongoose = require("mongoose")

let OrderSchema = mongoose.Schema({
    autoId:{type:Number, default:1},
   addedById:{type:mongoose.Schema.Types.ObjectId, default:null, ref:"UserModel"},
   shippingAddress:{type:String, default:""},
   totalPrice:{type:Number, default:0},
   status:{type:String, enum:["Placed","Shipped","Delivered","Cancelled"], default:'Placed'},
   createdAt:{type:Date , default:Date.now()}
})

module.exports = mongoose.model("OrderModel", OrderSchema)
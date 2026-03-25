const mongoose=require("mongoose")

let CartSchema=mongoose.Schema({
    autoId:{type:Number, default:1},
    addedById:{type:mongoose.Schema.Types.ObjectId, default:null, ref:"UserModel"},
    productId:{type:mongoose.Schema.Types.ObjectId, default:null, ref:"ProductModel"},
    quantity:{type:Number, default:1},
    status:{type:Boolean, default:true},
    createdAt:{type:Date, default:Date.now()}
})

module.exports=mongoose.model("CartModel", CartSchema)
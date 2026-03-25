const mongoose = require("mongoose")

let ProductSchema = mongoose.Schema({
    autoId:{type:Number, default:1},
    brandId: { type:mongoose.Schema.Types.ObjectId,  default: null, ref:"BrandModel" },
    categoryId:{type:mongoose.Schema.Types.ObjectId, default:null, ref:"CategoryModel"},
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "no-pic.jpg"},
    price: { type: Number, default:0 },
    gender:{type:String, default:"unisex"},
    size:{type:String, default:"M"},
    type:{type:String, default:""},
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now() }
})

module.exports = mongoose.model("ProductModel", ProductSchema)
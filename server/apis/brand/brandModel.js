const mongoose = require("mongoose");

const BrandSchema = mongoose.Schema({
    autoId: { type: Number, default: 1 },
    brandName: { type: String, default: "" },
    image: { type: String, default: "no-pic.jpg"},
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now() }
})

module.exports = mongoose.model("BrandModel", BrandSchema);
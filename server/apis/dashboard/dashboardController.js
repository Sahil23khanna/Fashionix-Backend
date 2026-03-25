const BrandModel = require("../brand/brandModel")
const ProductModel = require("../product/productModel")
const CategoryModel = require("../category/categoryModel")

const UserModel = require("../users/userModel")


dashboard = async(req,res) => {
    try{
         let totalBrand = await BrandModel.countDocuments().exec()
         let totalProduct = await ProductModel.countDocuments().exec()
         let totalCategory = await CategoryModel.countDocuments().exec()
         let totalCustomer = await UserModel.countDocuments({userType:2}).exec()

         console.log(totalBrand, totalCategory, totalProduct, totalCustomer);

         res.json({
            status:200,
            success:true,
            message:"Dashboard Loaded",
            totalBrand,
            totalCategory,
            totalProduct,
            totalCustomer
         })
         
    }
    catch(err){
        res.json({
            status:500,
            success:false,
            message:"Internal Server Error"
        })
    }
}

module.exports = {dashboard}
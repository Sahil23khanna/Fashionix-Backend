const CategoryController = require("../apis/category/categoryController")
const ProductController = require("../apis/product/productController")
const BrandController = require("../apis/brand/brandController")
const CustomerController = require("../apis/customer/customerController")
const UserController = require("../apis/users/userController")

const router = require("express").Router()

// Auth Routes
router.post("/customer/register", CustomerController.register)
router.post("/user/login",UserController.login)

 // Product Routes
router.post("/product/all",ProductController.all)
router.post("/product/single",ProductController.single)

// Brand Routes
router.post("/brand/all",BrandController.all)
router.post("/brand/single",BrandController.single)

 // Category Routes
router.post("/category/all",CategoryController.all)
router.post("/category/single",CategoryController.single) 

//General Token Checker
router.use(require("../middleware/tokenChecker"))

//change Passwored Route
router.post("/user/changePassword",UserController.changePassword)

module.exports= router;
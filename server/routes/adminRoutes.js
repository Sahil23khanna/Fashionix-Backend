const multer = require("multer")
const CategoryController = require("../apis/category/categoryController")
const BrandController = require("../apis/brand/brandController")
const ProductController = require("../apis/product/productController")
const CustomerController = require("../apis/customer/customerController")
const DashboardController = require("../apis/dashboard/dashboardController")
const OrderController = require("../apis/order/orderController")

const router = require("express").Router()

// token Checker
router.use(require("../middleware/adminTokenChecker"))

// ONE multer instance
const upload = multer({
  storage: multer.memoryStorage()
})

/* const brandStorage = multer.memoryStorage()  // buffer object
const brandUpload = multer({storage: brandStorage })  */

// Category Routes
router.post("/category/add", upload.single("image"), CategoryController.add)
router.post("/category/update", upload.single("image"), CategoryController.update)
router.post("/category/changeStatus", CategoryController.changeStatus)

// Brand Routes
router.post('/brand/add', upload.single("image"), BrandController.add)
router.post('/brand/update', upload.single("image"), BrandController.update)
router.post('/brand/changeStatus', BrandController.changeStatus)

// Product Routes
router.post('/product/add',upload.single("image"),ProductController.add)
router.post('/product/update',upload.single("image"),ProductController.update)
router.post('/product/changeStatus', ProductController.changeStatus)

// Customer Route
router.post('/customer/changeStatus',CustomerController.changeStatus)
router.post('/customer/all',CustomerController.allCustomers)
router.post('/customer/single',CustomerController.singleCustomer)

// Admin Dashboard
router.post('/dashboard/dashboard',DashboardController.dashboard)

// Order Route
router.post("/order/updateStatus",OrderController.updateStatus)
router.post("/order/all",OrderController.allAdminOrder)
router.post("/order/single",OrderController.singleAdminOrder)

module.exports = router
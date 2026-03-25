const CartController = require('../apis/cart/cartController')
const CustomerController = require('../apis/customer/customerController')
const OrderController = require('../apis/order/orderController')
const OrderDetailController = require('../apis/orderdetail/orderdetailController')
const router = require("express").Router()


//Customer Token Checker
router.use(require("../middleware/customerTokenChecker"))

// Cart
router.post('/cart/add',CartController.add)
router.post('/cart/all',CartController.all)
router.post('/cart/update',CartController.update)
router.post('/cart/deleteItem',CartController.deleteItem)

// Order
router.post('/order/add',OrderController.add)
router.post('/order/cancel',OrderController.cancel)
router.post('/order/allOrders',OrderController.allCustomerOrder)
router.post('/order/singleOrder',OrderController.singleCustomerOrder)

// Order Details
router.post('/orderdetails/all', OrderDetailController.allCustomerOrderDetails)

// Update Details
router.post('/customer/update',CustomerController.update)


module.exports = router
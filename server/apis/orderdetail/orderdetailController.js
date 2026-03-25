const OrderDetailModel = require("../orderdetail/orderdetailModel");

allCustomerOrderDetails = (req, res) => {
    
  OrderDetailModel.find()
    .populate({
      path: "orderId",
      match: { addedById: req.decoded.userId }, // ONLY logged-in user's orders
    })
    .populate("productId")
    .then((orderDetails) => {

      // remove null orders (important!)
      const filteredData = orderDetails.filter(
        (item) => item.orderId !== null
      );

      if (filteredData.length > 0) {
        res.json({
          status: 200,
          success: true,
          message: "Orders loaded",
          data: filteredData,
        });
      } else {
        res.json({
          status: 404,
          success: false,
          message: "No orders found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: 500,
        success: false,
        message: "Internal server error!!",
      });
    });
};




module.exports = { allCustomerOrderDetails };
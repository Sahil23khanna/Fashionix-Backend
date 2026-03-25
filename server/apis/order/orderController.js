const OrderModel = require("../order/orderModel")
const OrderDetailsModel = require("../orderdetail/orderdetailModel")
const CartModel = require("../cart/cartModel")
const nodemailer = require("nodemailer")


add = async (req, res) => {
    let validation = ""
    let formData = req.body
    if (!formData.shippingAddress) {
        validation += "Shipping address is required"
    }
    if (!!validation.trim()) {
        res.json({
            status: 422,
            success: false,
            message: validation
        })
    } else {
        let orderObj = new OrderModel()
        let total = await OrderModel.countDocuments().exec()
        orderObj.shippingAddress = formData.shippingAddress
        orderObj.addedById = req.decoded.userId
        orderObj.autoId = total + 1
        orderObj.save()
            .then((orderData) => {
                let totalPrice = 0
                CartModel.find({ addedById: req.decoded.userId })
                    .populate("productId")
                    .then(async (cartData) => {
                        for (let i = 0; i < cartData.length; i++) {
                            totalPrice += parseInt(cartData[i].productId.price) * parseInt(cartData[i].quantity)
                            let orderDetailsObj = new OrderDetailsModel()
                            let total = await OrderDetailsModel.countDocuments().exec()
                            orderDetailsObj.autoId = total + 1
                            orderDetailsObj.productId = cartData[i].productId
                            orderDetailsObj.quantity = cartData[i].quantity
                            orderDetailsObj.orderId = orderData._id
                            orderDetailsObj.save()
                                .then((orderDetailsData) => {
                                    console.log(orderDetailsData);


                                })
                                .catch((err) => {
                                    res.json({
                                        status: 500,
                                        success: false,
                                        message: "Internal server error!!"
                                    })
                                })
                        }
                        CartModel.deleteMany({ addedById: req.decoded.userId })
                            .then(() => {
                                OrderModel.findById(orderData._id)
                                    .then((orderData) => {
                                        orderData.totalPrice = totalPrice
                                        orderData.save()
                                            .then(async (orderData) => {
                                                const transporter = nodemailer.createTransport({
                                                    host: "smtp.gmail.com",
                                                    port: 587,
                                                    secure: false, // true for port 465, false for other ports
                                                    auth: {
                                                        user: process.env.SMTP_USER,
                                                        pass: process.env.SMTP_PASS,
                                                    },
                                                });
                                                const info = await transporter.sendMail({
                                                    from: '"Shopzy 👻" <sahilkkhanna2330@gmail.com>', // sender address
                                                    to: req.decoded.email, // list of receivers
                                                    subject: "Order Confirmation - Thank You for Your Purchase ✔ ", // Subject line
                                                    text: `Dear Customer,
                                       Thank you for placing your order with us.
                                       We are pleased to inform you that your order has been successfully placed and is currently being processed. Our team will notify you once your order is shipped.
                                       If you have any questions or need assistance, feel free to contact our support team.
                                       Thank you for choosing us.
                                       Best regards,
                                       Shopzy,
                                       Customer Support Team`, // plain text body

                                                    html: `<div style="font-family: Arial, sans-serif; color: #333;">
    <h2 style="color: #2c3e50;">Order Confirmation</h2>
    <p>Dear Customer,</p>
    <p>Thank you for placing your order with us.</p>
    <p>
      We are pleased to inform you that your order has been 
      <b>successfully placed</b> and is currently being processed.
    </p>
    <p>
      You will receive another notification once your order is shipped.
    </p>
    <p>
      If you have any questions or need assistance, please contact our support team.
    </p>
    <br/>
    <p>Thank you for choosing us.</p>
    <p>
      <b>Best regards,</b><br/>
      Shopzy<br/>
      Customer Support Team
    </p>
  </div>`, // html body
                                                });
                                                res.json({
                                                    status: 200,
                                                    success: true,
                                                    message: "Ordered successfully",
                                                    order: orderData
                                                })
                                            })
                                            .catch((err) => {
                                                console.log(err.message);

                                                res.json({
                                                    status: 500,
                                                    success: false,
                                                    message: "Internal server error!!"
                                                })
                                            })
                                    })
                                    .catch((err) => {
                                        res.json({
                                            status: 500,
                                            success: false,
                                            message: "Internal server error!!"
                                        })
                                    })

                            })
                            .catch((err) => {
                                res.json({
                                    status: 500,
                                    success: false,
                                    message: "Internal server error!!"
                                })
                            })
                    })
                    .catch((err) => {

                        res.json({
                            status: 500,
                            success: false,
                            message: "Internal server error!!"
                        })
                    })
            })
            .catch((err) => {
                res.json({
                    status: 500,
                    success: false,
                    message: "Internal server error!!"
                })
            })

    }
}

cancel = (req, res) => {
    let validation = ""
    let formData = req.body

    if (!formData._id) {
        validation += "Order id is required"
    }

    if (!!validation.trim()) {
        res.json({
            status: 422,
            success: false,
            message: validation
        })
    } else {

        OrderModel.findOne({
            _id: formData._id,
            addedById: req.decoded.userId
        })
            .then(async (orderData) => {

                if (!orderData) {
                    res.json({
                        status: 404,
                        success: false,
                        message: "Order not found"
                    })
                }
                else if (orderData.status === "Shipped" || orderData.status === "Delivered") {
                    res.json({
                        status: 422,
                        success: false,
                        message: "Order cannot be cancelled after shipping"
                    })
                }
                else if (orderData.status === "Cancelled") {
                    res.json({
                        status: 422,
                        success: false,
                        message: "Order already cancelled"
                    })
                }
                else {
                    orderData.status = "Cancelled"

                    orderData.save()
                        .then(async (updatedOrder) => {

                            // 📧 Cancel email
                            const transporter = nodemailer.createTransport({
                                host: "smtp.gmail.com",
                                port: 587,
                                secure: false,
                                auth: {
                                    user: process.env.SMTP_USER,
                                    pass: process.env.SMTP_PASS,
                                },
                            })

                            await transporter.sendMail({
                                from: '"Fashionix 👻" <sahilkkhanna2330@gmail.com>',
                                to: req.decoded.email,
                                subject: "Order Cancelled ❌",
                                text: "Your order has been cancelled successfully.",
                                html: "<b>Your order has been cancelled successfully.</b>",
                            })

                            res.json({
                                status: 200,
                                success: true,
                                message: "Order cancelled successfully",
                                order: updatedOrder
                            })
                        })
                        .catch((err) => {
                            res.json({
                                status: 500,
                                success: false,
                                message: "Internal server error!!"
                            })
                        })
                }
            })
            .catch((err) => {
                res.json({
                    status: 500,
                    success: false,
                    message: "Internal server error!!"
                })
            })
    }
}

updateStatus = (req, res) => {
    let validation = ""
    let formData = req.body

    if (!formData._id) {
        validation += "Order id is required "
    }
    if (!formData.status) {
        validation += "Status is required"
    }

    if (!!validation.trim()) {
        res.json({
            status: 422,
            success: false,
            message: validation
        })
    } else {

        OrderModel.findById(formData._id)
            .then((orderData) => {

                if (!orderData) {
                    res.json({
                        status: 404,
                        success: false,
                        message: "Order not found"
                    })
                }
                else if (!["Shipped", "Delivered"].includes(formData.status)) {
                    res.json({
                        status: 422,
                        success: false,
                        message: "Invalid status update"
                    })
                }
                else {
                    orderData.status = formData.status

                    orderData.save()
                        .then((updatedOrder) => {
                            res.json({
                                status: 200,
                                success: true,
                                message: "Order status updated",
                                order: updatedOrder
                            })
                        })
                        .catch(() => {
                            res.json({
                                status: 500,
                                success: false,
                                message: "Internal server error!!"
                            })
                        })
                }
            })
            .catch(() => {
                res.json({
                    status: 500,
                    success: false,
                    message: "Internal server error!!"
                })
            })
    }
}

allCustomerOrder = (req, res) => {

    OrderModel.find({ addedById: req.decoded.userId })
        .populate("addedById")
        .then((orderData) => {

            if (orderData.length > 0) {
                res.json({
                    status: 200,
                    success: true,
                    message: "Orders loaded",
                    data: orderData
                })
            } else {
                res.json({
                    status: 404,
                    success: false,
                    message: "No orders found"
                })
            }
        })
        .catch((err) => {
            res.json({
                status: 500,
                success: false,
                message: "Internal server error!!"
            })
        })
}

/* allAdminOrder = (req, res) => {
    OrderModel.find()
        .populate("addedById")

        .then(async (orderData) => {

            if (orderData.length > 0) {
                 let total = await OrderModel.countDocuments().exec()
                res.json({
                    status: 200,
                    success: true,
                    message: "All orders loaded",
                    total,
                    data: orderData
                })
            } else {
                res.json({
                    status: 404,
                    success: false,
                    message: "No orders found"
                })
            }
        })
        .catch((err) => {
            res.json({
                status: 500,
                success: false,
                message: "Internal server error!!"
            })
        })
} */

allAdminOrder = async (req, res) => {
  try {
    const limit = Number(req.body.limit) || 10;
    const currentPage = Number(req.body.currentPage) || 1;
    const skip = (currentPage - 1) * limit;

    const total = await OrderModel.countDocuments();

    const orderData = await OrderModel.find()
      .populate("addedById", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      status: 200,
      success: true,
      message: "All orders loaded",
      total,
      data: orderData
    });

  } catch (err) {
    res.json({
      status: 500,
      success: false,
      message: "Internal server error"
    });
  }
};


singleCustomerOrder = async (req, res) => {
    let validation = ""
    let formData = req.body

    if (!formData._id) {
        validation += "_id is required"
    }

    if (!!validation.trim()) {
        return res.json({
            status: 422,
            success: false,
            message: validation
        })
    }

    try {
        const order = await OrderModel.findOne({
            _id: formData._id,
            addedById: req.decoded.userId
        })

        if (!order) {
            return res.json({
                status: 404,
                success: false,
                message: "No order found"
            })
        }

        const orderDetails = await OrderDetailsModel.find({
            orderId: order._id
        }).populate("productId")

        res.json({
            status: 200,
            success: true,
            message: "Order found",
            order,
            items: orderDetails
        })

    } catch (err) {
        res.json({
            status: 500,
            success: false,
            message: "Internal server error"
        })
    }
}

singleAdminOrder = async (req, res) => {
    let validation = ""
    let formData = req.body

    if (!formData._id) {
        validation += "_id is required"
    }

    if (!!validation.trim()) {
        return res.json({
            status: 422,
            success: false,
            message: validation
        })
    }

    try {
        const order = await OrderModel.findById(formData._id)
            .populate("addedById", "name email")

        if (!order) {
            return res.json({
                status: 404,
                success: false,
                message: "No order found"
            })
        }

        const orderDetails = await OrderDetailsModel.find({
            orderId: order._id
        }).populate("productId")

        res.json({
            status: 200,
            success: true,
            message: "Order found",
            order,
            items: orderDetails
        })

    } catch (err) {
        res.json({
            status: 500,
            success: false,
            message: "Internal server error"
        })
    }
}



module.exports = { add, cancel, updateStatus, allCustomerOrder, allAdminOrder, singleAdminOrder, singleCustomerOrder }
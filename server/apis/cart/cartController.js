const CartModel = require("./cartModel")

add = (req, res) => {
    let validation = ""
    let formData = req.body
    if (!formData.productId) {
        validation += "Product id is required"
    }
    if (!!validation.trim()) {
        res.json({
            status: 422,
            success: false,
            message: validation
        })
    }
    else {
        CartModel.findOne({ productId: formData.productId, addedById: req.decoded.userId })

            .then(async (cartData) => {
                if (!cartData) {
                    let cartObj = new CartModel()
                    let total = await CartModel.countDocuments().exec()
                    cartObj.productId = formData.productId
                    cartObj.quantity = 1
                    cartObj.addedById = req.decoded.userId
                    cartObj.save()

                        .then((cartData) => {
                            res.json({
                                status: 200,
                                success: true,
                                message: "Added to cart successfully",
                                data: cartData
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

                else{
                    cartData.quantity+=1
                    cartData.save()
                    .then((cartData)=>{
                    res.json({
                        status:200,
                        success:true,
                        message:"Cart updated successfully",
                        data:cartData
                    })
                })
                .catch((err)=>{
                    res.json({
                        status:500,
                        success:false,
                        message:"Internal server error!!"
                    })
                })
                }
            })
         .catch((err)=>{
            res.json({
                status:500,
                success:false,
                message:"Internal server error!!"
            })
        })
    }
}


all = (req,res)=>{
    CartModel.find({addedById:req.decoded.userId})

    .populate({
        path:"productId",
        populate:"brandId"
    })

     .then((cartData)=>{
        if(cartData.length>0){
            res.json({
                status:200,
                success:true,
                message:"Cart loaded",
                data:cartData
            })
        }else{
            res.json({
                status:404,
                success:false,
                message:"No data in cart"
            })
        }
    })
}

update = (req, res) => {
    let validation = ""
    let formData = req.body

    if (!formData._id) {
        validation += "Cart id is required "
    }
    if (!formData.quantity === undefined) {
        validation += "Quantity is required"
    }

    if (!!validation.trim()) {
        res.json({
            status: 422,
            success: false,
            message: validation
        })
    }
    else {
        CartModel.findOne({
            _id: formData._id,
            addedById: req.decoded.userId
        })
        .then((cartData) => {

            if (!cartData) {
                res.json({
                    status: 404,
                    success: false,
                    message: "Cart item not found"
                })
            }
            else {

                if (formData.quantity < 1) {
                    res.json({
                        status: 422,
                        success: false,
                        message: "Quantity must be at least 1"
                    })
                }
                else {
                    cartData.quantity = formData.quantity

                    cartData.save()
                    .then((updatedData) => {
                        res.json({
                            status: 200,
                            success: true,
                            message: "Cart updated successfully",
                            data: updatedData
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

deleteItem = (req, res) => {
    let validation = ""
    let formData = req.body

    if (!formData._id) {
        validation += "Cart id is required"
    }

    if (!!validation.trim()) {
        res.json({
            status: 422,
            success: false,
            message: validation
        })
    }
    else {
        CartModel.findOne({
            _id: formData._id,
            addedById: req.decoded.userId
        })
        .then((cartData) => {

            if (!cartData) {
                res.json({
                    status: 404,
                    success: false,
                    message: "Cart item not found"
                })
            }
            else {
                CartModel.deleteOne({
                    _id: formData._id
                })
                .then(() => {
                    res.json({
                        status: 200,
                        success: true,
                        message: "Item removed from cart"
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



module.exports = {add,all,update,deleteItem}
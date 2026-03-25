const ProductModel = require("./productModel")
const { uploadImg } = require("../../utilities/helper")

// Adding Product
add = (req, res) => {
    let validation = ""
    let formData = req.body
    // validation check
    if (!formData.title) {
        validation += "Product name is reqired"
    }

    if (!formData.price) {
        validation += "Price is reqired"
    }

    if (!formData.brandId) {
        validation += "Brand ID is reqired"
    }

    if (!formData.categoryId) {
        validation += "Category ID is reqired"
    }

    if (!formData.description) {
        validation += "Description is required"
    }

    if (!req.file) {
        validation += "Image is required"
    }

    if (!formData.gender) {
        validation += "Gender is required"
    }

    if (!formData.size) {
        validation += "Size is required"
    }

    if (!formData.type) {
        validation += "Type is required"
    }

    if (!!validation.trim()) {
        res.json({
            status: 422,
            success: false,
            message: validation
        })
    }
    else {
        ProductModel.findOne({ title: formData.title })

            .then(async (productData) => {
                if (!productData) {
                    let productObj = new ProductModel()
                    let total = await ProductModel.countDocuments().exec()
                    productObj.title = formData.title
                    productObj.description = formData.description
                    productObj.price = formData.price
                    productObj.brandId = formData.brandId
                    productObj.categoryId = formData.categoryId

                    productObj.gender = formData.gender
                    productObj.size = formData.size
                    productObj.type = formData.type

                    try {
                        let url = await uploadImg(req.file.buffer)
                        productObj.image = url
                    }
                    catch (err) {
                        res.json({
                            status: 500,
                            success: false,
                            message: "error while uploading image!!"
                        })
                    }

                    productObj.autoId = total + 1
                    productObj.save()

                        .then((productData) => {
                            res.json({
                                status: 200,
                                success: true,
                                message: "Product Added !",
                                data: productData
                            })
                        })
                        .catch((err) => {
                            res.json({
                                status: 500,
                                success: false,
                                message: "Internal server error",
                                error: err
                            })
                        })
                }

                else {
                    res.json({
                        status: 200,
                        success: true,
                        message: "Product already exists",
                        data: productData
                    })
                }
            })

            .catch((err) => {
                res.json({
                    status: 500,
                    success: false,
                    message: "Internal server error",
                    error: err
                })
            })
    }

}

// Fetching all Product
all = (req, res) => {
    let formData = req.body
    let limit = formData.limit
    let currentPage = formData.currentPage
    delete formData.limit
    delete formData.currentPage

    ProductModel.find(formData)
        .populate({ path: "brandId", select: "brandName" })
        .populate({ path: "categoryId", select: "categoryName description" })
        .limit(limit)
        .skip((currentPage - 1) * limit)

        .then(async (productData) => {
            if (productData.length > 0) {
                let total = await ProductModel.countDocuments().exec()
                res.json({
                    status: 200,
                    success: true,
                    message: "Product loaded",
                    total: total,
                    data: productData
                })
            } else {
                res.json({
                    status: 404,
                    success: false,
                    message: "No Product Found!!",
                    data: productData
                })
            }

        })
        .catch((err) => {
            res.json({
                status: 500,
                success: false,
                message: "Internal server error",
                error: err
            })
        })
}


// Fetch single Product
single = (req, res) => {
    let validation = ""
    let formData = req.body

    if (!formData._id) {
        validation += "_id is required"
    }
    if (!!validation.trim()) {
        res.json({
            status: 422,
            success: false,
            message: validation
        })
    }
    else {
        ProductModel.findOne({ _id: formData._id })

        .populate("categoryId", "categoryName")
        .populate("brandId", "brandName")

            .then((productData) => {
                if (!productData) {
                    res.json({
                        status: 404,
                        success: false,
                        message: "No Product found"
                    })
                }
                else {
                    res.json({
                        status: 200,
                        success: true,
                        message: "Product found",
                        data: productData
                    })
                }
            })

            .catch((err) => {
                res.json({
                    status: 500,
                    success: false,
                    message: "Internal server error",
                    error: err
                })
            })
    }

}

// Updaing Product
update = (req, res) => {
    let validation = ""
    let formData = req.body
    if (!formData._id) {
        validation += "_id is required"
    }
    if (!!validation.trim()) {
        res.json({
            status: 422,
            success: false,
            message: validation
        })
    }
    else {
        ProductModel.findOne({ _id: formData._id })

            .then(async (productData) => {
                if (!productData) {
                    res.json({
                        status: 404,
                        success: false,
                        message: "Product not found"
                    })
                }
                else {

                    if (!!formData.title) {
                        productData.title = formData.title
                    }

                    if (!!formData.description) {
                        productData.description = formData.description
                    }

                    if (!!formData.price) {
                        productData.price = formData.price
                    }

                    if (!!formData.brandId) {
                        productData.brandId = formData.brandId
                    }

                    if (!!formData.categoryId) {
                        productData.categoryId = formData.categoryId
                    }

                    if (req.file && req.file.buffer) {
                        try {
                            let imageUrl = await uploadImg(req.file.buffer)
                            productData.image = imageUrl
                        }
                        catch (err) {
                            return res.json({
                                status: 500,
                                success: false,
                                message: "Error While Uploading Image",
                                error: err
                            })
                        }
                    }

                    if (!!formData.gender) {
                        productData.gender = formData.gender
                    }

                    if (!!formData.size) {
                        productData.size = formData.size
                    }

                    if (!!formData.type) {
                        productData.type = formData.type
                    }

                    productData.save()

                        .then((productData) => {
                            res.json({
                                status: 200,
                                success: true,
                                message: "Product Updated",
                                data: productData
                            })
                        })

                        .catch((err) => {
                            res.json({
                                status: 500,
                                success: false,
                                message: "Internal Server Error",
                                error: err
                            })
                        })
                }
            })

            .catch((err) => {
                res.json({
                    status: 500,
                    success: false,
                    message: "Internal Server Error",
                    error: err
                })
            })

    }
}

// Change Status of Product
changeStatus = (req, res) => {
    let validation = ""
    let formData = req.body
    if (!formData._id) {
        validation += "_id is required"
    }
    if (!!validation.trim()) {
        res.json({
            status: 422,
            success: false,
            message: validation
        })
    }
    else {
        ProductModel.findOne({ _id: formData._id })

            .then((productData) => {
                if (!productData) {
                    res.json({
                        status: 404,
                        success: false,
                        message: "No Product Found"
                    })
                }
                else {
                    productData.status = formData.status
                    productData.save()

                        .then((productData) => {
                            res.json({
                                status: 200,
                                success: true,
                                message: "Status Updated Successfully",
                                data: productData
                            })
                        })
                        .catch((err) => {
                            res.json({
                                status: 500,
                                success: false,
                                message: "Internal server error",
                                error: err
                            })
                        })
                }
            })

            .catch((err) => {
                res.json({
                    status: 500,
                    success: false,
                    message: "Internal server error",
                    error: err
                })
            })

    }
}


module.exports = { add, all, single, update, changeStatus }




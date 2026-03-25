const CategoryModel = require("./categoryModel")
const {uploadImg} = require("../../utilities/helper")


// Adding Category
add = (req, res) => {
    let validation = ""
    let formData = req.body
    // validation check
    if (!formData.categoryName) {
        validation += "Category name is reqired"
    }
    if (!req.file) {
        validation += "Image is required"
    }

    if (!formData.description) {
        validation += "Description is required"
    }


    if (!!validation.trim()) {
        res.json({
            status: 422,
            success: false,
            message: validation
        })
    }
    else {
        CategoryModel.findOne({ categoryName: formData.categoryName })

            .then(async (categoryData) => {
                if (!categoryData) {
                    let categoryObj = new CategoryModel()
                    let total = await CategoryModel.countDocuments().exec()
                    categoryObj.categoryName = formData.categoryName
                    categoryObj.autoId = total + 1
                    categoryObj.description = formData.description

                    try {
                        let url = await uploadImg(req.file.buffer)
                        categoryObj.image = url
                    }
                    catch (err) {
                        res.json({
                            status: 500,
                            success: false,
                            message: "error while uploading image!!"
                        })
                    }
                    categoryObj.save()

                        .then((categoryData) => {
                            res.json({
                                status: 200,
                                success: true,
                                message: "Category Added !",
                                data: categoryData
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
                        message: "Category already exists",
                        data: categoryData
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

// Fetching all Categories
all = (req, res) => {
    let formData = req.body
    let limit = formData.limit
    let currentPage = formData.currentPage
    delete formData.limit
    delete formData.currentPage

    CategoryModel.find(formData)
        .limit(limit)
        .skip((currentPage - 1) * limit)

        .then(async (categoryData) => {
            if (categoryData.length > 0) {
                let total = await CategoryModel.countDocuments().exec()
                res.json({
                    status: 200,
                    success: true,
                    message: "category loaded",
                    total: total,
                    data: categoryData
                })
            } else {
                res.json({
                    status: 404,
                    success: false,
                    message: "No category Found!!",
                    data: categoryData
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

// Fetch single Category
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
        CategoryModel.findOne({ _id: formData._id })

            .then((categoryData) => {
                if (!categoryData) {
                    res.json({
                        status: 404,
                        success: false,
                        message: "No Category found"
                    })
                }
                else {
                    res.json({
                        status: 200,
                        success: true,
                        message: "Category found",
                        data: categoryData
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

// Updaing Category
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
        CategoryModel.findOne({ _id: formData._id })

            .then(async (categoryData) => {
                if (!categoryData) {
                    res.json({
                        status: 404,
                        success: false,
                        message: "Category not found"
                    })
                }
                else {
                    if (!!formData.categoryName) {
                        categoryData.categoryName = formData.categoryName
                    }

                    if (!!formData.description) {
                        categoryData.description = formData.description
                    }

                    if (req.file && req.file.buffer) {
                        try {
                            let imageUrll= await uploadImg(req.file.buffer)
                            categoryData.image = imageUrll
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

                    categoryData.save()

                        .then((categoryData) => {
                            res.json({
                                status: 200,
                                success: true,
                                message: "Category Updated",
                                data: categoryData
                            })
                        })

                        .catch((err) => {
                            return res.json({
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

// Change Status of Category
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
        CategoryModel.findOne({ _id: formData._id })

            .then((categoryData) => {
                if (!categoryData) {
                    res.json({
                        status: 404,
                        success: false,
                        message: "No Category Found"
                    })
                }
                else {
                    categoryData.status = formData.status
                    categoryData.save()

                        .then((categoryData) => {
                            res.json({
                                status: 200,
                                success: true,
                                message: "Status Updated Successfully",
                                data: categoryData
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


module.exports= {add, all, single, update, changeStatus}
const UserModel = require("../users/userModel")
const CustomerModel = require("./customerModel")
const bcryptjs = require("bcryptjs")

register = (req, res) => {

    let validation = ""
    let formData = req.body
    if (!formData.name) {
        validation += "Name is required"
    }
    if (!formData.email) {
        validation += "Email is required"
    }
    if (!formData.password) {
        validation += "Password is required"
    }
    if (!formData.phone) {
        validation += " phone is required"
    }
    if (!formData.address) {
        validation += " address is required"
    }
    if (!!validation.trim()) {
        res.json({
            status: 422,
            success: false,
            message: validation
        })
    }

    else {
        UserModel.findOne({ email: formData.email })

            .then(async (userData) => {
                if (!userData) {
                    // first insert in UserModel
                    let userTotal = await UserModel.countDocuments().exec()
                    let userObj = new UserModel()
                    userObj.autoId = userTotal + 1
                    userObj.name = formData.name
                    userObj.email = formData.email
                    userObj.password = bcryptjs.hashSync(formData.password, 10)
                    userObj.userType = 2
                    userObj.save()

                        //Now insert in customer Model
                        .then(async (userData) => {
                            let customerTotal = await CustomerModel.countDocuments().exec()
                            let customerObj = new CustomerModel()
                            customerObj.autoId = customerTotal + 1
                            customerObj.phone = formData.phone
                            customerObj.address = formData.address
                            customerObj.userId = userData._id
                            customerObj.save()

                                .then((customerData) => {
                                    res.json({
                                        status: 201, // created
                                        success: true,
                                        message: "Customer Registered Successfully !",
                                        customerData,
                                        userData
                                    })
                                })

                                .catch((err) => {
                                    res.json({
                                        status: 500,
                                        success: false,
                                        message: "Internal server error!!",
                                        error: err
                                    })
                                })
                        })

                        .catch((err) => {
                            res.json({
                                status: 500,
                                success: false,
                                message: "Internal server error!!",
                                error: err
                            })
                        })
                }

                else {
                    res.json({
                        status: 200,
                        success: false,
                        message: "User Already Exists !",
                        data: userData
                    })
                }
            })

            .catch((err) => {
                res.json({
                    status: 500,
                    success: false,
                    message: "Internal server error!!",
                    error: err
                })
            })
    }
}

update = (req, res) => {
    let formData = req.body
    UserModel.findOne({ _id: req.decoded.userId })

        .then((userData) => {
            if (!userData) {
                res.json({
                    status: 404,
                    success: false,
                    message: "No user found"
                })
            }
            else {
                if (!!formData.name) {
                    userData.name = formData.name
                }
                userData.save()

                    .then((userData) => {
                        CustomerModel.findOne({ userId: req.decoded.userId })
                            .then((customerData) => {
                                if (!customerData) {
                                    res.json({
                                        status: 404,
                                        success: false,
                                        message: "No customer found!!"
                                    })
                                }
                                else {
                                    if (!!formData.phone) {
                                        customerData.phone = formData.phone
                                    }
                                    if (!!formData.address) {
                                        customerData.address = formData.address
                                    }
                                    customerData.save()
                                        .then((customerData) => {
                                            res.json({
                                                status: 200,
                                                success: true,
                                                message: "Profile updated",
                                                userData,
                                                customerData
                                            })
                                        })
                                        .catch((err) => {
                                            res.json({
                                                status: 500,
                                                success: false,
                                                message: err?.message
                                            })
                                        })
                                }
                            })

                            .catch((err) => {
                                res.json({
                                    status: 500,
                                    success: false,
                                    message: err?.message
                                })
                            })

                    })

                    .catch((err) => {
                        res.json({
                            status: 500,
                            success: false,
                            message: err?.message
                        })
                    })
            }
        })

        .catch((err) => {
            res.json({
                status: 500,
                success: false,
                message: err?.message
            })
        })
}

changeStatus = (req, res) => {
    let formData = req.body
    let validation = ""
    if (!formData._id) {
        validation += "_id is required"
    }
    if (formData.status == null || formData.status == undefined) {
        validation += "Status is required"
    }
    if (!!validation) {
        res.json({
            status: 422,
            success: false,
            message: validation
        })
    } else {
        UserModel.findOne({ _id: formData._id })
            .then((userData) => {
                if (!userData) {
                    res.json({
                        status: 404,
                        success: false,
                        message: "No user found!!"
                    })
                } else {
                    userData.status = formData.status
                    userData.save()
                        .then((userData) => {
                            CustomerModel.findOne({ userId: formData._id })
                                .then((customerData) => {
                                    if (!customerData) {
                                        res.json({
                                            status: 404,
                                            success: false,
                                            message: "No customer found!!"
                                        })
                                    } else {
                                        customerData.status = formData.status
                                        customerData.save()
                                            .then((customerData) => {
                                                res.json({
                                                    status: 200,
                                                    success: true,
                                                    message: "Status updated",
                                                    userData,
                                                    customerData
                                                })
                                            })
                                            .catch((err) => {
                                                res.json({
                                                    status: 500,
                                                    success: false,
                                                    message: err?.message
                                                })
                                            })
                                    }
                                })
                                .catch((err) => {
                                    res.json({
                                        status: 500,
                                        success: false,
                                        message: err?.message
                                    })
                                })

                        })
                        .catch((err) => {
                            res.json({
                                status: 500,
                                success: false,
                                message: err?.message
                            })
                        })
                }
            })

            .catch((err) => {
                res.json({
                    status: 500,
                    success: false,
                    message: err?.message
                })
            })
    }

}

allCustomers = (req, res) => {

    CustomerModel.find()
        .populate({ path: "userId", select: "name email" })

        .then(async (customerData) => {
            if (customerData.length > 0) {
                let total = await CustomerModel.countDocuments().exec()
                res.json({
                    status: 200,
                    success: true,
                    message: "All Customers Loaded",
                    total,
                    data: customerData
                })
            }
            else {
                res.json({
                    status: 404,
                    success: false,
                    message: "No Customer Found!!",
                    data: customerData
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

singleCustomer = (req, res) => {
    let validation = ""
    let formData = req.body

    if (!formData.userId) {
        validation += "UserId is required"
    }

    if (!!validation.trim()) {
        res.json({
            status: 422,
            success: false,
            message: validation
        })
    }

    else {
        CustomerModel.findOne({ userId: formData.userId })
            .populate({ path: "userId", select: "name email" })

            .then((customerData) => {
                if (!customerData) {
                    res.json({
                        status: 404,
                        success: false,
                        message: "No Customer Found !"
                    })
                }
                else {
                    res.json({
                        status: 200,
                        success: true,
                        message: "Customer Found !",
                        data: customerData
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

module.exports = { register, update, changeStatus, allCustomers, singleCustomer }
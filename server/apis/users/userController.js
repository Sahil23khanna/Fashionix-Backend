const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const UserModel = require("./userModel")
const SECRET = "MyProject@233"


login = (req, res) => {
    let validation = ""
    let formData = req.body
    if (!formData.email) {
        validation += "Email is required"
    }
    if (!formData.password) {
        validation += " Password is required"
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

            .then((userData) => {
                if (!userData) {
                    res.json({
                        status: 404,
                        success: false,
                        message: "User doesn't exist"
                    })
                }
                else {
                    let result = bcryptjs.compareSync(formData.password, userData.password)

                    if (result) {
                        let payload = {
                            userId: userData._id,
                            email: userData.email,
                            userType: userData.userType,
                            name: userData.name
                        }

                        let token = jwt.sign(payload, SECRET, { expiresIn: "24h" })
                        res.json({
                            status: 200,
                            success: true,
                            message: "Login successfully!!",
                            token,
                            data: userData
                        })
                    }
                    else {
                        res.json({
                            status: 200,
                            success: false,
                            message: "Invalid credentials"
                        })
                    }
                }
            })
            .catch((err) => {
                res.json({
                    status: 500,
                    success: false,
                    message: "Internal server error!!!",
                    error: err
                })
            })
    }
}

changePassword = (req, res) => {

    let validation = ""
    let formData = req.body
    if (!formData.oldPassword) {
        validation += "Old Password is required"
    }
    if (!formData.newPassword) {
        validation += "New Password is required"
    }
    if (!formData.confirmPassword) {
        validation += "Confirm Password id required"
    }
    if (!!validation.trim()) {
        res.json({
            status: 422,
            success: false,
            message: validation
        })
    }

    else {
        if (formData.newPassword === formData.confirmPassword) {
            UserModel.findOne({ _id: req.decoded.userId })
                .then((userData) => {
                    let result = bcryptjs.compareSync(formData.oldPassword, userData.password)
                    if (result) {
                        userData.password = bcryptjs.hashSync(formData.newPassword, 10)
                        userData.save()

                            .then((userData) => {
                                res.json({
                                    status: 200,
                                    success: true,
                                    message: "Password changed successfully!!"
                                })
                            })
                            .catch((err) => {
                                res.json({
                                    status: 500,
                                    success: false,
                                    message: "Internal server error"
                                })
                            })
                    }
                    else {
                        res.json({
                            status: 200,
                            success: false,
                            message: "Old Password doesn't match!"
                        })
                    }
                })
                .catch((err) => {
                    res.json({
                        status: 500,
                        success: false,
                        message: "Internal server error"
                    })
                })
        }
        else {
            res.json({
                status: 200,
                success: false,
                message: "New Password doesn't match with confirm password"
            })
        }
    }
}



module.exports = {login,changePassword}
const { uploadImg } = require("../../utilities/helper")
const BrandModel = require("./brandModel")

// Adding Brand
add = (req, res) => {
    let validation = ""
    let formData = req.body
    // validation check
    if (!formData.brandName) {
        validation += "Brand name is reqired"
    }

    if (!req.file) {
        validation += "Image is required"
    }

    if (!!validation.trim()) {
        res.json({
            status: 422,
            success: false,
            message: validation
        })
    }
    else {
        BrandModel.findOne({ brandName: formData.brandName })

            .then(async (brandData) => {
                if (!brandData) {
                    let brandObj = new BrandModel()
                    let total = await BrandModel.countDocuments().exec()
                    brandObj.brandName = formData.brandName

                    try {
                        let url = await uploadImg(req.file.buffer) //we will only send buffer object to the cloudinary upload
                        brandObj.image = url
                    }
                    catch (err) {
                        res.json({
                            status: 500,
                            success: false,
                            message: "error while uploading image!!"
                        })
                    }

                    brandObj.autoId = total + 1
                    brandObj.save()

                    .then((brandData) => {
                            res.json({
                                status: 200,
                                success: true,
                                message: "Brand Added !",
                                data: brandData
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

                else{
                     res.json({
                        status: 200,
                        success: true,
                        message: "Brand already exists",
                        data: brandData
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

// Fetching all Brands
all = (req, res) => {
    let formData = req.body
    let limit = formData.limit
    let currentPage = formData.currentPage
    delete formData.limit
    delete formData.currentPage

    BrandModel.find(formData)
        .limit(limit)
        .skip((currentPage - 1) * limit)

        .then(async (brandData) => {
            if (brandData.length > 0) {
                let total = await BrandModel.countDocuments().exec()
                res.json({
                    status: 200,
                    success: true,
                    message: "Brand loaded",
                    total: total,
                    data: brandData
                })
            } else {
                res.json({
                    status: 404,
                    success: false,
                    message: "No brand Found!!",
                    data: brandData
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

// Fetch single Brand
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
        BrandModel.findOne({ _id: formData._id })

            .then((brandData) => {
                if (!brandData) {
                    res.json({
                        status: 404,
                        success: false,
                        message: "No brand found"
                    })
                }
                else {
                    res.json({
                        status: 200,
                        success: true,
                        message: "Brand found",
                        data: brandData
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

// Updaing Brand
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
        BrandModel.findOne({ _id: formData._id })

            .then(async(brandData) => {
                if (!brandData) {
                    res.json({
                        status: 404,
                        success: false,
                        message: "brand not found"
                    })
                }
                else {
                    if (!!formData.brandName) {
                        brandData.brandName = formData.brandName
                    }

                   if (req.file && req.file.buffer) {
                    try{
                        let imageUrl = await uploadImg(req.file.buffer)
                        brandData.image = imageUrl
                    }
                    catch(err){
                        return res.json({
                            status:500,
                            success:false,
                            message:"Error While Uploading Image",
                            error:err
                        })
                    }
                   }

                    brandData.save()

                        .then((brandData) => {
                            res.json({
                                status: 200,
                                success: true,
                                message: "Brand Updated",
                                data: brandData
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

// Change Status of Brand
changeStatus=(req,res)=>{
   let validation = ""
   let formData = req.body
   if (!formData._id) {
    validation+="_id is required"
   }
   if (!!validation.trim()) {
    res.json({
        status:422,
        success:false,
        message:validation
    })
   }
   else{
     BrandModel.findOne({_id:formData._id})

     .then((brandData)=>{
        if (!brandData) {
            res.json({
                status:404,
                success:false,
                message:"No Brand Found"
            })
        }
        else{
            brandData.status = formData.status
            brandData.save()

            .then((brandData)=>{
                res.json({
                    status:200,
                    success:true,
                    message:"Status Updated Successfully",
                    data:brandData
                })
            })
            .catch((err)=>{
                res.json({
                        status:500,
                        success:false,
                        message:"Internal server error",
                        error:err
                    })
            })
        }
     })

     .catch((err)=>{
            res.json({
                status:500,
                success:false,
                message:"Internal server error",
                error:err
            })
        })

   }
}


module.exports = { add, all, single, update, changeStatus }
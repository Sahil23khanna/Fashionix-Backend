const UserModel = require("../apis/users/userModel")
const bcryptjs = require("bcryptjs")

UserModel.findOne({email:"sahil23@gmail.com"})

.then((userData)=>{
    if (!userData) {
        let userObj = new UserModel()
        userObj.autoId =1 
        userObj.name = "admin"
        userObj.email= "sahil23@gmail.com"
        userObj.password= bcryptjs.hashSync("123", 10)
        userObj.userType = 1
        userObj.save()

         .then((userData)=>{
            console.log("Admin seeded successfully")
        })
        .catch((err)=>{
            console.log("Error while seeding admin", err);
        })
    }
    else{
        console.log("Admin already exists!!");
        
    }
})
.catch((err)=>{
    console.log("Error while seeding admin",err);
})
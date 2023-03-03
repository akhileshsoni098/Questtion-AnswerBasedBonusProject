const express = require("express")


const router = express.Router()

const userController = require("../controller/userController")


router.post("/register" , userController.userRegistration )

// router.get("/hello", (req, res)=>{
// res.send({status:true , message: " hii there Akhilesh Soni Here"})
// })


module.exports = router
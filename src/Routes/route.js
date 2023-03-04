const express = require("express")


const router = express.Router()

const userController = require("../controller/userController")

const aws = require("../middi/aws")

router.post("/register" , userController.userRegistration )
router.post("/logIn" , userController.logIn )
router.post("/question/:userId",aws.awsLink,  userController.createQuestion )
router.put("/updateQ/:questionId/:userId",aws.awsLink,  userController.updateQuestions )
router.get("/getQues/:userId",userController.AdminAndStudentGetQues )
router.post("/answer/:questionId/:userId", userController.anwserData)

module.exports = router
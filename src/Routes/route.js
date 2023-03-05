const express = require("express")


const router = express.Router()

const userController = require("../controller/userController")
const middil = require("../middi/auth")
const aws = require("../middi/aws")

router.post("/register" , userController.userRegistration )
router.post("/logIn" , userController.logIn )
router.post("/question/:userId",middil.authentication , aws.awsLink,  userController.createQuestion )
router.put("/updateQ/:questionId/:userId", middil.authentication,  aws.awsLink,  userController.updateQuestions )
router.get("/getQues/:userId", middil.authentication , userController.AdminAndStudentGetQues )
router.post("/answer/:questionId/:userId",middil.authentication, userController.anwserData)

module.exports = router
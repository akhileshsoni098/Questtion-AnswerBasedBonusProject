const userModel = require("../models/userModel");
const questionModel = require("../models/questionModel");
const jwt = require("jsonwebtoken");
const answerModel = require("../models/answerModel");

const userRegistration = async (req, res) => {
  const data = req.body;

  let { name, email, password, role } = data;

  if (!name) {
    return res.status(400).send({ status: false, message: "name is required" });
  }

  if (!email) {
    return res
      .status(400)
      .send({ status: false, message: "email is required" });
  }

  const emailExist = await userModel.findOne({ email: email });

  if (emailExist) {
    return res
      .status(400)
      .send({ status: false, message: "this email is already exist" });
  }

  if (!password) {
    return res
      .status(400)
      .send({ status: false, message: "password is required" });
  }

  if (!role) {
    return res.status(400).send({ status: false, message: "role is required" });
  }

  if (!["admin", "student"].includes(role)) {
    return res
      .status(400)
      .send({ status: false, message: "register as a Admin /Student" });
  }

  const userData = await userModel.create(data);

  res.status(201).send({ status: true, data: userData });
};

const logIn = async (req, res) => {
  const data = req.body;
  const { email, password } = data;

  if (!email) {
    return res
      .status(400)
      .send({ status: false, message: "email is required" });
  }

  if (!password) {
    return res
      .status(400)
      .send({ status: false, message: "password is required" });
  }

  const emailPassCheck = await userModel.findOne({ email: email });
  if (!emailPassCheck) {
    return res.status(400).send({ status: false, message: "Invaild email" });
  }

  if (emailPassCheck.password != password) {
    return res
      .status(400)
      .send({ status: false, message: "Incorrect password" });
  }

  let token = jwt.sign({ userId: emailPassCheck._id }, "secrateKey");

  res
    .status(201)
    .send({ status: true, message: "successfully logIn", token: token });
};

const createQuestion = async (req, res) => {
  const userId = req.params.userId; // authorization part me admin hoga tabhi create kr sktta h nhi toh nhi userId.role se check krenge
  const adminCheck = await userModel.findOne({ _id: userId });
  if (adminCheck.role != "admin") {
    return res.status(403).send({
      status: false,
      message: " you don't have access of this feature",
    });
  }
  let data = req.body;
  let {
    question,
    options,
    answer,
    difficulty,
    selectedOption,
    image,
    createdBy,
  } = data;
  if (!question) {
    return res
      .status(400)
      .send({ status: false, message: "question is mandatory" });
  }

  if (!options) {
    return res
      .status(400)
      .send({ status: false, message: "options is mandatory" });
  }
  if (!answer) {
    return res
      .status(400)
      .send({ status: false, message: "answer is mandatory" });
  }

  if (!difficulty) {
    return res
      .status(400)
      .send({ status: false, message: "difficulty is mandatory" });
  }
  if (!["easy", "medium", "hard"].includes(difficulty)) {
    return res
      .status(400)
      .send({ status: false, message: "difficulty is mandatory" });
  }

  createdBy = data.createdBy = userId;

  image = data.image = req.image;

  const saveQues = await questionModel.create(data);

  res.status(201).send({ status: false, data: saveQues });
};

const updateQuestions = async (req, res) => {
  const questionId = req.params.questionId;
  const userId = req.params.userId; // authorization part me admin hoga tabhi create kr sktta h nhi toh nhi userId.role se check krenge

  const adminCheck = await userModel.findOne({ _id: userId });

  if (!adminCheck) {
    return res.status(400).send({ status: false, message: " user not exist" });
  }
  if (adminCheck.role == "student") {
    return res.status(403).send({
      status: false,
      message: " you don't have access of this feature",
    });
  }

  let data = req.body;
  let {
    question,
    options,
    answer,
    difficulty,
    selectedOption,
    image,
    createdBy,
  } = data;

  if (difficulty) {
    if (!["easy", "medium", "hard"].includes(difficulty)) {
      return res
        .status(400)
        .send({ status: false, message: "difficulty is mandatory" });
    }
  }

  createdBy = data.createdBy = userId;

  image = data.image = req.image;

  // if (question || options || answer || difficulty|| image){

  let updateQue = await questionModel.findOneAndUpdate(
    { _id: questionId },
    {
      $set: {
        question: data.question,
        options: options,
        answer: data.answer,
        difficulty: data.difficulty,
        image: image,
      },
    },
    { new: true }
  );

  res.status(200).send({ status: true, message: updateQue });
};
// }

const AdminAndStudentGetQues = async (req, res) => {
  const userId = req.params.userId;

  let checkUser = await userModel.findById(userId);
  if (!checkUser) {
    return res
      .status(400)
      .send({ status: false, message: "User doesn't exist" });
  }

  //want to hide some data for student ...

  if (checkUser.role == "student") {
    let getDatastudent = await questionModel.find().select({
      question: 1,
      options: 1,
      difficulty: 1,
      image: 1,
      createdBy: 1,
    });

    return res.status(200).send({
      status: true,
      data: getDatastudent,
    });
  }

  let getDataAdmin = await questionModel.find();
  if (checkUser.role == "admin") {
    res.status(200).send({ status: false, data: getDataAdmin });
  }
};

const anwserData = async (req, res) => {
  const questionId = req.params.questionId;
  const userId = req.params.userId;

  const userdata = await userModel.findById(userId);
  if (!userdata) {
    return res
      .status(400)
      .send({ status: false, message: "user does not exist" });
  }
  if (userdata.role == "admin") {
    return res
      .status(400)
      .send({ status: false, message: "Only Student can answer " });
  }

  let data = req.body;
  let { question, selectedOption, answeredBy } = data;

  let query = await questionModel.findByIdAndUpdate({ _id: questionId });

  if (selectedOption) {
    question = questionId;
    answeredBy = userId;
    let saveData = await answerModel.create(data);

    if (saveData.selectedOption == query.answer) {
      let answerUpdate = await answerModel.findOneAndUpdate(
        { _id: saveData._id, isCorrect: false },
        { isCorrect: true },
        { new: true }
      );

      res.status(201).send({ status: true, data: answerUpdate });
    }
  }
};

module.exports = {
  userRegistration,
  logIn,
  createQuestion,
  updateQuestions,
  AdminAndStudentGetQues,
  anwserData,
};

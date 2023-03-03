const userModel = require("../models/userModel");

const jwt = require("jsonwebtoken");

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

 let token = jwt.sign({userId:emailPassCheck._id}, "secrateKey")

res.status(201).send({status:true , message:"successfully logIn", token:token})
};

module.exports = { userRegistration, logIn };

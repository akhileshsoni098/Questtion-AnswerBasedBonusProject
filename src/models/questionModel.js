const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    options: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    difficulty:{
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    selectedOption:{
      type: String,
      default: null,
    },
    image:{
      type: String,
    },
    createdBy: {
      type: ObjectId,
      ref: "user",
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Question", questionSchema);

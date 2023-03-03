const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const answerSchema = new mongoose.Schema({
  question: {
    type: ObjectId,
    ref: "Question",
    required: true,
  },
  selectedOption: {
    type: String,
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },
  answeredBy: {
    type: ObjectId,
    ref: "user",
    required: true,
  },
});

module.exports = mongoose.model("Answer", answerSchema);

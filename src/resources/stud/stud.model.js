var mongoose = require("mongoose");

var usersSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  name: {
    type: String,
  },
  fname: {
    type: String,
  },
  evidence: {
    type: String,
  },
  course_code: {
    type: Number,
  },
  course_name: {
    type: String,
  },
  date: {
    type: String,
  },
  time: {
    type: String ,
    
  },
  seat_number: {
    type: Number,
  },
  exam_type: {
    type: String,
  },
  course_type: {
    type: String,
  },
  department: {
    type: String,
  },
  class: {
    type: String,
  },
  row: {
    type: String,
  }
});

module.exports = mongoose.model("stud", usersSchema);
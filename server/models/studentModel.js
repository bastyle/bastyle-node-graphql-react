const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    min: 18,
    required: true,
    default: 21
  },
  major: {
    type: String,
  },
  year: {
    type: Number,
    min: 1,
    max: 4,
    required: true,
    default: 2

  },
})

module.exports = mongoose.model('Student', studentSchema)

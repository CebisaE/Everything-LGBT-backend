const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
  phone_number: {
    type: Number,
    required: true,
  },
  join_date: {
    type: String,
    default: Date.now,
  },
  cart: {
    type: Array,
    required: false,
    default: [],
  },
  roles: {
    type: String,
    required: true,
    default:"customer"
  }
});

module.exports = mongoose.model("Customer", customerSchema);
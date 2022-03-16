const Customer = require("../models/customer.models");

checkDuplicateCustomernameOrEmail = async (req, res, next) => {
  let customer;
  try {
    customer = await Customer.findOne({ name: req.body.name });
    email = await Customer.findOne({ email: req.body.email });
    if (customer || email) {
      return res
        .status(404)
        .send({ message: "name or email already exists." });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  next();
};

module.exports = checkDuplicateCustomernameOrEmail;
const db = require("../models");
const ROLES = db.ROLES;
const Customer = db.customer;

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

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`
        });
        return;
      }
    }
  }
  next();
};

const verifySignUp = {
  checkDuplicateCustomernameOrEmail,
  checkRolesExisted
};
module.exports = verifySignUp;
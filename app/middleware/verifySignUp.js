const db = require("../models");
const ROLES = db.ROLES;
const Customer = db.customer;
checkDuplicatenameOrEmail = (req, res, next) => {
  Customer.findOne({
    name: req.body.name
  }).exec((err, customer) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (customer) {
      res.status(400).send({ message: "Failed! name is already in use!" });
      return;
    }
    User.findOne({
      email: req.body.email
    }).exec((err, customer) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (customer) {
        res.status(400).send({ message: "Failed! Email is already in use!" });
        return;
      }
      next();
    });
  });
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
  checkDuplicatenameOrEmail,
  checkRolesExisted
};
module.exports = verifySignUp;
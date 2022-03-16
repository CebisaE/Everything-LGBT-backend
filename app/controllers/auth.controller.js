const config = require("../config/auth.config");
const db = require("../models");
const Customer= db.customer;
const Role = db.role;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
exports.signup = (req, res) => {
  const customer = new Customer({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });
  customer.save((err, customer) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          customer.roles = roles.map(role => role._id);
          customer.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.send({ message: "Customer was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "customer" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        customer.roles = [role._id];
        customer.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.send({ message: "Customer was registered successfully!" });
        });
      });
    }
  });
};
exports.signin = (req, res) => {
  Customer.findOne({
    name: req.body.name
  })
    .populate("roles", "-__v")
    .exec((err, customer) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!customer) {
        return res.status(404).send({ message: "Customer Not found." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        customer.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }
      var token = jwt.sign({ id: customer.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      var authorities = [];
      for (let i = 0; i < customer.roles.length; i++) {
        authorities.push("ROLE_" + customer.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: customer._id,
        name: customer.name,
        email: customer.email,
        roles: authorities,
        accessToken: token
      });
    });
};
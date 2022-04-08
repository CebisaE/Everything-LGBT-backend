// require("dotenv").config();
const express = require("express");
const router = express.Router();
const Customer = require("../models/customer.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/authJwt");
// const nodemailer = require('nodemailer')

async function getCustomer(req, res, next) {
  let customer;
  try {
    customer = await Customer.findById(req.params.id);
    if (customer == null) {
      return res.status(404).json({ message: "Cannot find Customer" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.customer = customer;
  next();
}

async function DuplicatedCustomernameorEmail(req, res, next) {
  let customer;
  try {
    customer = await Customer.findOne({ name: req.body.name });
    email = await Customer.findOne({ email: req.body.email });
    if (customer || email) {
      return res.status(404).send({ message: "name already exists" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  next();
}
//getting all customer//
router.get("/", async (req, res) => {
  try {
    const customer = await Customer.find();
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//getting one customer//
router.get("/:id", getCustomer, (req, res) => {
  res.json(res.customer);
});

//creating a new customer//
router.post("/signup", DuplicatedCustomernameorEmail, async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const customer = new Customer({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      phone_number: req.body.phone_number,
    });
    const newCustomer = await customer.save();

    res.status(201).json(newCustomer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
//logging in a customer//
router.post("/signin", async (req, res) => {
  try {
    Customer.findOne({ email: req.body.email }, (err, customer) => {
      if (err) return handleError(err);
      if (!customer) {
        return res.status(404).send({ message: "customer Not found." });
      }
      let passwordIsValid = bcrypt.compare(
        req.body.password,
        customer.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      // console.log(process.env.ACCESS_TOKEN_SECRET)
      let token = jwt.sign({ _id: customer._id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: 86400, 
      });
      res.status(200).send({
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        password: customer.password,
        phone_number: customer.phone_number,
        cart: customer.cart,
        accessToken: token,
        roles:customer.roles
      });
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
//updating a customer//
router.put("/:id",getCustomer, async (req, res) => {
  if (req.body.id != req.customer_Id) {
    return res.status(401).send({ message: "Unauthorized!" });
  }
  if (req.body.name != null) {
    res.customer.name = req.body.name;
  }
  if (req.body.email != null) {
    res.customer.email = req.body.email;
  }
  if (req.body.password != null) {
    res.customer.password = req.body.password;
  }
  if (req.body.phone_number != null) {
    res.customer.phone_number = req.body.phone_number;
  }
  if (req.body.join_date != null) {
    res.customer.join_date = req.body.join_date;
  }
  try {
    const updatedCustomer = await res.customer.save();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
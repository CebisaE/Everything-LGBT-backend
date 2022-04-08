// require("dotenv").config();
const express = require("express");
const router = express.Router();
const Customer = require("../models/customer.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/authJwt");
const nodemailer = require('nodemailer')



async function DuplicatedEmail(req, res, next) {
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
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
      }
    });
    
    const mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "You have been registered successfully",
      text: `Thank you ${req.body.name} for signing up with Everything LGBT+ 
      `
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
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
      let passwordIsValid = bcrypt.compareSync(
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
router.patch("/:id", [verifyToken ,getCustomer], async (req, res) => {
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
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS
        }
      });
      
      const mailOptions = {
        from: process.env.EMAIL,
        to: req.body.email,
        subject: `${req.body.name} your account has been updated succesfully..`,
        text: `
        ${req.body.name} Your account has been updated succesfully.
        `
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    res.json(updatedCustomer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
//deleting a customer//
router.delete("/:id", [verifyToken,getCustomer], async (req, res) => {
  const  { name , email } = res.customer
  try {
    await res.customer.remove();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
      }
    });
    
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: `${name} your accout has been removed`,
      text: `thanks for using us
      `
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }try {
          res.json({ message: `thank you ${name}, your email was sent`})
      } catch (error) {
          res.status(500).send( {message: error.message} )
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// app.get(
//   "/api/test/admin",
//   [authJwt.verifyToken, authJwt.isAdmin],
//   controller.adminBoard
// );

module.exports = router;
const express = require("express");
const verifyToken = require("../middleware/authJwt");
const Customer = require("../models/customer.model");
const getProduct = require("../middleware/obtain");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Product = require("../models/product.model");

router.get("/", [getCustomer], (req, res) => {
  return res.send(res.customer.cart);
});

router.post("/:id", [ getCustomer], async (req, res) => {
  let product = await Product.findById(req.params.id).lean();
  let qty = req.body.qty;
  let cart = res.customer.cart;
  let added = false;
  cart.forEach((item) => {
    if (item._id.valueOf() == product._id.valueOf()) {
      item.qty += qty;
      added = true;
    }
  });

  if (!added) {
    cart.push({ ...product, qty });
  }
  try {
    res.customer.cart = cart;

    let token = jwt.sign(
      { _id: req.customerId, cart: res.customer.cart },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: 86400, // 24 hours
      }
    );
    const updatedCustomer = await res.customer.save();
    res.status(200).json({ updatedCustomer, token });
  } catch (error) {
    console.log(error);
  }
});

router.put("/:id", [ getProduct], async (req, res) => {
  const customer = await Customer.findById(req.customer._id);
  const inCart = customer.cart.some((prod) => prod._id == req.params._id);

  let updatedCustomer;
  if (inCart) {
    const product = customer.cart.find((prod) => prod._id == req.params._id);
    product.qty += req.body.qty;
    updatedCustomer = await customer.save();
  } else {
    customer.cart.push({ ...res.product, qty: req.body.qty });
    updatedCustomer = await customer.save;
  }
  try {
    const ACCESS_TOKEN_SECRET = jwt.sign(
      JSON.stringify(updatedCustomer),
      process.env.ACCESS_TOKEN_SECRET
    );
    res.status(201).json({ jwt: ACCESS_TOKEN_SECRET, cart: updatedCustomer.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", [ getCustomer], async (req, res) => {
  let cart = res.customer.cart;
  cart.forEach((cartitem) => {
    if (cartitem._id == req.params.id) {
      cart = cart.filter((cartitems) => cartitems._id != req.params.id);
    }
  });
  try {
    res.customer.cart = cart;

    const updated = res.customer.save();
    let token = jwt.sign(
      { _id: req.customerId, cart },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: 86400, // 24 hours
      }
    );
    res.json({ message: "Deleted product", updated, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getCustomer(req, res, next) {
  let customer;
  try {
    customer = await Customer.findById(req.customerId);
    if (customer == null) {
      return res.status(404).json({ message: "Cannot find Customer" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.customer = customer;
  next();
}

module.exports = router;
const express = require("express");
const verifyToken = require("../middleware/authJwt");
const Customer = require("../models/customer.model");
const getProduct = require("../middleware/obtain");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Product = require("../models/product.model");

// GET USER CART
app.get("/:id/cart", [verifyToken, getCustomer], (req, res, next) => {
  try {
    res.json(req.customer.cart);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// ADD PRODUCT TO USER CART
app.post(
  "/:id/cart",
  [verifyToken, getProduct],
  async (req, res, next) => {
    const customer = await Customer.findById(req.customer._id);

    // let product_id = res.product._id;
    let title = res.product.title;
    let category = res.product.category;
    let description = res.product.description;
    let img = res.product.img;
    let price = res.product.price;
    // let quantity = req.body.quantity;
    // let created_by = req.customer._id;

    try {
      customer.cart.push({
        // product_id,
        title,
        category,
        description,
        img,
        price,
        // quantity,
        // created_by,
      });
      const updatedCustomer = await customer.save();
      res.status(201).json(updatedCustomer);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// UPDATE PRODUCT IN USER CART
app.put(
  "/:id/cart",
  [verifyToken, getProduct],
  async (req, res, next) => {
    const customer = await Customer.findById(req.customer._id);
    const inCart = customer.cart.some((prod) => prod.product_id == req.params.id);
    console.log(inCart);

    if (inCart) {
      try {
        const product = customer.cart.find(
          (prod) => prod.product_id == req.params.id
        );
        product.quantity = req.body.quantity;
        customer.cart.quantity = product.quantity;
        customer.markModified("cart");
        const updatedCustomer = await customer.save();
        console.log(updatedCustomer);
        res.status(201).json(updatedCustomer.cart);
      } catch (error) {
        res.status(500).json(console.log(error));
      }
    }
  }
);

// DELETE PRODUCT IN USER CART'
app.delete(
  "/:id/cart",
  [verifyToken, getProduct],
  async (req, res, next) => {
    res.send(res.customer);
    // try {
    //   await res.user.cart.remove();
    //   res.json({ message: "Deleted Product" });
    // } catch (error) {
    //   res.status(500).json({ message: error.message });
    // }
  }
);
module.exports = router;
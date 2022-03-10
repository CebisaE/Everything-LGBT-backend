const express = require("express");
const router = express.Router();
const Product = require("../models/product.model.js");

//getting all products//
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//getting one product//
router.get("/:id", getProduct, (req, res) => {
  res.send(req.product);
});
//creating a product//
router.post("/", async (req, res) => {
  const product = new Product({
    title: req.body.title,
    price: req.body.price,
    category: req.body.category,
    img: req.body.img,
    description: req.body.description,
  });
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
//updating a product//
router.put("/:id", getProduct, async (req, res) => {
  if (req.body.title != null) {
    res.product.title = req.body.title;
  }
  if (req.body.price != null) {
    res.product.price = req.body.price;
  }
  if (req.body.category != null) {
    res.product.category = req.body.category;
  }
  if (req.body.img != null) {
    res.product.img = req.body.img;
  }
  try {
    const updatedProduct = await res.product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
//deleting a product//
router.delete("/:id", getProduct, async (req, res) => {
  try {
    await res.product.remove();
    res.json({ message: "Product Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getProduct(req, res, next) {
  try {
    product = await Product.findById(req.body.id);
    if (product == null) {
      return res.status(404).json({ message: "Cannot find product" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.product = product;
  next();
}

module.exports = router;
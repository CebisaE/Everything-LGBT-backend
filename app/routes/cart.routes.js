const express = require("express");
const verifyToken = require("../middleware/authJwt");
const Customer = require("../models/customers");
const getProduct = require("../middleware/obtain");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Product = require("../models/products.models");

router.get("/", [verifyToken, getCustomer], (req, res) => {
    return res.send(res.customer.cart);
  });
  
router.post("/:id", [verifyToken, getCustomer],  async (req, res) =>{
  let product = await Product.findById(req.params.id).lean()
  let qty = req.body.qty
  let cart = res.customer.cart
  let added = false;
  cart.forEach(item =>{
    if(item._id.valueOf() == product._id.valueOf()){
      item.qty += qty
      added = true
    }
  })

  if(!added){
    cart.push({...product, qty});
  }
  try {
    res.customer.cart = cart

    let token = jwt.sign({ _id:  req.customerId, cart: res.user.cart }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: 86400 // 24 hours
    });
    const updatedCustomer = await res.user.save();
    res.status(200).json({ updatedCustomer,token})
  } catch (error) {
    console.log(error)
  }
});

router.delete("/", [verifyToken, getCustomer], async (req, res) => {
    try{
        res.customer.cart = []

        await res.customer.save()
        res.json({ message:'Cleared Item'})
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});

router.delete("/:id", [verifyToken, getCustomer], async (req, res) => {
  let cart = res.customer.cart;
  cart.forEach((cartitem) => {
    if (cartitem._id == req.params.id) {
      cart = cart.filter((cartitems) => cartitems._id != req.params.id);
    }
  });
  try {
    res.customer.cart = cart;

    const updated = res.customer.save();
    let token = jwt.sign({ _id: req.customerId, cart }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: 86400, // 24 hours
    });
    res.json({ message: "Deleted product", updated, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", [verifyToken, getProduct], async (req, res) => {
  const customer = await Customer.findById(req.customerId);
  const inCart = customer.cart.some((prod) => prod._id == req.params._id);
  
    let updatedCustomer;
    if (inCart) {
      const product = customer.cart.find((prod) => prod._id == req.params._id);
      product.qty += req.body.qty;
      updatedCustomer = await customer.save();
    } else {
      customer.cart.push({ ...res.product, qty: req.body.qty });
      updatedCustomer = await customer.save();
    }
    try {

      console.log(updatedCustomer,process.env.ACCESS_TOKEN_SECRET)
      const acces_token = jwt.sign(
        JSON.stringify(updatedCustomer),
        process.env.ACCESS_TOKEN_SECRET
      );
      
      res.status(201).json({ jwt: acces_token, cart: updatedCustomer.cart });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

   

async function getCustomer(req, res, next) {
    let customer
   try{
       customer = await customer.findById(req.customerId)
      if(customer == null){
          return res.status(404).json({ message:'Cannot find Customer' })
      } 
   } catch (err) {
       return res.status(500).json({ message: err.message })
   }

   res.customer = customer
   next()
}



module.exports = router;
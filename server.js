require("dotenv").config();
const express = require('express')
const cors = require("cors")
const mongoose = require('mongoose')
const db = require('./app/models')
const Role = db.role
const productsRouter = require('./app/routes/products.routes')
const customerRouter = require('./app/routes/customer.routes')
const contactRouter = require('./app/routes/contact.routes')
const authRouter = require('./app/routes/auth.routes')

const app = express()
app.set('port',process.env.PORT || 3000);
app.use(express.json())
app.use(cors())

mongoose.connect(process.env.DATABASE_URL,{ useNewUrlParser: true })


function initial() {
    Role.estimatedDocumentCount((err, count) => {
      if (!err && count === 0) {
        new Role({
          name: "customer"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
          console.log("added 'customer' to roles collection");
        });
        new Role({
          name: "admin"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
          console.log("added 'admin' to roles collection");
        });
      }
    });
  }



app.get('/', (req, res) => {
    res.send('Welcome to EverthingLGBT+ clothing shop! -Enjoy your Stay although there`s nothing to do here it`s just a bunch of code')
})

const cartRouter = require("./app/routes/cart.routes");
app.use('/products', productsRouter)
app.use('/contact',contactRouter)
app.use('/customer', customerRouter)
app.use("/cart", cartRouter)
app.use('/auth', authRouter)
// app.use ('')
// app.use('')
// const port = process.env.PORT || 3000

app.listen(app.get("port"), () => {
    console.log(`Server started`)
});


module.exports = app;
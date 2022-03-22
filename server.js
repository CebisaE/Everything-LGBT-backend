require("dotenv").config();
const express = require('express')
const cors = require("cors")
const mongoose = require('mongoose')

const productsRouter = require('./app/routes/products.routes')
const customerRouter = require('./app/routes/customer.routes')
const contactRouter = require('./app/routes/contact.routes')

const app = express()
app.set('port',process.env.PORT || 3000);
app.use(express.json())
app.use(cors())

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to Database'))

app.get('/', (req, res) => {
    res.send('Welcome to EverthingLGBT+ clothing shop! -Enjoy your Stay although there`s nothing to do here it`s just a bunch of code')
})

const cartRouter = require("./app/routes/cart.routes");
app.use('/products', productsRouter)
app.use('/contact',contactRouter)
app.use('/customer', customerRouter)
app.use("/cart", cartRouter);
// app.use('')
// const port = process.env.PORT || 3000

app.listen(app.get("port"), () => {
    console.log(`Server started`)
});


module.exports = app;
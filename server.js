require("dotenv").config();
const express = require('express')
const app = express()
const cors = require("cors")
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to Database'))

app.set('port',process.env.PORT || 3000);
app.use(express.json())
app.use(cors())

const productsRouter = require('./app/routes/products.routes')
const customerRouter = require('./app/routes/customer.routes')
app.get('/', (req, res) => {
    res.send('Hello World!')
})
const cartRouter = require("./app/routes/cart.routes");
app.use('/products', productsRouter)
app.use('/customer', customerRouter)

app.use("/cart", cartRouter);

const port = process.env.PORT || 3000

app.listen(app.get("port"), () => {
    console.log(`Server started on port ${port}`)
});

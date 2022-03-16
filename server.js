const express = require('express')
const app = express()
const cors = require("cors")
const mongoose = require('mongoose')

mongoose.connect(`mongodb+srv://emihle:Cebisa02@everythinglgbtplus.fcazp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())
app.use(cors())

const productsRouter = require('./app/routes/products.routes')
const customerRouter = require('./app/routes/customer.routes')

const cartRouter = require("./app/routes/cart.routes");
app.use('/products', productsRouter)
app.use('/customer', customerRouter)

app.use("/cart", cartRouter);

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server started on port ${port}`))
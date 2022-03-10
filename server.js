const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const db = require("./app/models");
const Role = db.role;
db.mongoose
  .connect(`mongodb+srv://emihle:Cebisa02@everythinglgbtplus.fcazp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    // initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });
// function initial() {
//   Role.estimatedDocumentCount((err, count) => {
//     if (!err && count === 0) {
//       new Role({
//         name: "customer"
//       }).save(err => {
//         if (err) {
//           console.log("error", err);
//         }
//         console.log("added 'customer' to roles collection");
//       });
//       new Role({
//         name: "admin"
//       }).save(err => {
//         if (err) {
//           console.log("error", err);
//         }
//         console.log("added 'admin' to roles collection");
//       });
//     }
//   });
// }
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Everything LGBT+ application." });
});
require('./app/routes/auth.routes')(app);
const customerRouter = require('./app/routes/customer.routes.js');
app.use('/customer',customerRouter)
const productsRouter = require('./app/routes/products.routes.js');
app.use('/products',productsRouter)
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
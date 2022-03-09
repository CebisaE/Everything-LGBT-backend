const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.customer = require("./customer.model");
db.role = require("./role.model");
db.ROLES = ["customer", "admin"];
module.exports = db;
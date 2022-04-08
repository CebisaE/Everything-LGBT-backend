const mongoose = require('mongoose');
mongoose.promise = global.promise;
const db={};
db.mongoose = mongoose;
db.customers =require('./customer.model')
db.role = require('./role.model')
db.ROLES -["customer","admin",];





module.exports = db;
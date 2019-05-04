const mongoose = require('mongoose');

//Schema for creating a user into the db
exports.user_schema = new mongoose.Schema({
  username:  String,
  role: String,
  password:   String,
  membership_payed: Boolean
});

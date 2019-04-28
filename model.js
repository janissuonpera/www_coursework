const mongoose = require('mongoose');
exports.user_schema = new mongoose.Schema({
  username:  String,
  role: String,
  password:   String,
});

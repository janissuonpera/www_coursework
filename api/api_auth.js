/*
======================================================================
For creating a new user with a POST request or updating a user with PATCH request
in the REST API, you need a JSON Web Token for authentication.
======================================================================
*/
var express = require('express')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const model = require('../model');

//Connect to a database
mongoose.connect('mongodb://localhost/www_coursework');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//Create a model from imported user_schema
var User = mongoose.model('user', model.user_schema);

//Import bcrypt
const bcrypt = require('bcryptjs');
const saltRounds = 10;

//Read JWT and attach it to the request
exports.read_JWT = function(req, res, next){
  var bearerHeader = req.headers['authorization'];
  if(bearerHeader && bearerHeader.startsWith('Bearer ')){
    var token = bearerHeader.slice(7, bearerHeader.length);
    req.token = token;
    next();
  }else{
    res.status(403).json({
      error: "Failure while reading JWT!",
      links:{
        all_users_url: 'http://localhost:5000/api/users'
      }
    })
  }
};

//Verify JWT
exports.verify_JWT = function(req, res, next){
  jwt.verify(req.token,'secretkey420', (err, authData) => {
    if(err){
      res.status(401).json({
        error: "JWT verification failed!",
        links:{
          all_users_url: 'http://localhost:5000/api/users'
        }
      })
    }else{
      //Attach authentication data to request so it can be viewed later.
      req.authData = authData;
      next();
    }
  })
}

const mongoose = require('mongoose');
const model = require('../model');
const { check, validationResult } = require('express-validator/check');

//Connect to a database
mongoose.connect('mongodb://localhost/www_coursework');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//Create a model from imported user_schema
var User = mongoose.model('user', model.user_schema);

//Import bcrypt
const bcrypt = require('bcryptjs');
const saltRounds = 10;

//Called when using get request to API. Returns all users and their data
exports.users_list = function(req, res, next){
  //Find all users in db
  User.find({}, function(err, users){
    //If error, return correct status and error message
    if(err){
      res.status(400).json({
        error: err.message
      })
    }
    else{
      res.status(200).json({
        count: users.length,
        users: users.map(user=>{
          //If spaces, handle them this way
          var spaceless_name = user.username.split(" ").join("%20");
          //Adds link to self to json
          return {
            username: user.username,
            role: user.role,
            membership_payed: user.membership_payed,
            links: {
              self_url: 'http://localhost:5000/api/users/' + spaceless_name
            }
          }
        })
      });
    }
  });
}

//Called when using get request to API. Returns single user and its data
exports.single_user = function(req, res, next){
  //Find user in db
  User.findOne({username: req.params.name}, function(err, user){
    //If error, return correct status and error message
    if(err){
      res.status(400).json({
        error: err.message
      })
    }
    else{
      console.log(user)
      if(user){
        res.status(200).json({
          user: {
            username: user.username,
            role: user.role,
            membership_payed: user.membership_payed,
            links: {
              all_users_url: 'http://localhost:5000/api/users'
            }
          }
        });
      }else{
        res.status(404).json({
          Error: "User not found in db!",
          links:{
            all_users_url: 'http://localhost:5000/api/users'
          }
        });
      }

    }
  });
}

//Called when adding a new user to api via post request to the API
exports.add_user = function(req, res, next){
  var username = req.body.username;
  var password = req.body.password;

  //Check if username already exists in db
  User.findOne({username: username}, function(err, user){

    const errors = validationResult(req);

    //Check that fields are validated
    if(errors.isEmpty()){
      //If error, return correct status and error message
      if(err){
        res.status(400).json({
          error: err.message,
          links:{
            all_users_url: 'http://localhost:5000/api/users'
          }
        })
      }
      else{
        //If user exists, return appropriate message as json
        if(user){
          res.status(409).json({
            Error: "Username already taken!",
            links:{
              all_users_url: 'http://localhost:5000/api/users'
            }
          });
        }else{
          //If username is free, hash the given password and save new user to db
          bcrypt.hash(password, saltRounds, function(err, hash) {
            //Generated hash is saved to the database instead of the actual password
            var new_user = new User({ username: username, password: hash, role: "registered", membership_payed: false});
            new_user.save(function (err) {
              if (err){
                res.status(400).json({
                  error: err.message,
                  links:{
                    all_users_url: 'http://localhost:5000/api/users'
                  }
                })
              }else{
                res.status(200).json({
                  message: "New user created!",
                  user: new_user,
                  links:{
                    all_users_url: 'http://localhost:5000/api/users'
                  }
                })
              }
            });
          });
        }

      }
    }else{
      res.status(400).json({
        message: "Invalid input!",
        links:{
          all_users_url: 'http://localhost:5000/api/users'
        }
      })
    }
  });
}

//Called when updating a specific user's data
exports.update_user = function(req, res, next){
  var username = req.body.username;
  var password = req.body.password;

  //Checking that middleware validators caught no errors.
  const errors = validationResult(req);
  //Check that no errors and user at least specified one field to update
  if(errors.isEmpty() && (username || password)){
    //Check if user wants to update username
    if(username){
      //Check that username is not already taken by someone else
      User.findOne({username: username}, (err, user)=>{
        if(err){
          res.status(400).json({
            message: "Error occurred!",
            links:{
              all_users_url: 'http://localhost:5000/api/users'
            }
          })
        }
        //If username is not already taken, in other words it's not found in db.
        if(!user){
          //Change username to the one specified in the post request
          User.updateOne({ username: req.session.username }, { username: username }, function(err, result) {
            if(err){return console.log("Error with updating user", err)}
            console.log("Username change successful.");
            //Remember to change session username as well.
            req.session.username = username;
            req.session.message = "Update successful!";
            res.redirect('/user/profile');
          });
        }else{
          res.status(409).json({
            message: "Username already taken!",
            links:{
              all_users_url: 'http://localhost:5000/api/users'
            }
          })
        }
      });
    }
    //Check if user wants to update password
    if(password){

    }
  }else{
    res.status(400).json({
      message: "Error occurred!",
      links:{
        all_users_url: 'http://localhost:5000/api/users'
      }
    })
  }

}

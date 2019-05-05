const mongoose = require('mongoose');
const model = require('../model');
const { check, validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken')

//Connect to a database
mongoose.connect('mongodb://localhost/www_coursework');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//Create a model from imported user_schema
var User = mongoose.model('user', model.user_schema);

//Import bcrypt
const bcrypt = require('bcryptjs');
const saltRounds = 10;

//Called when using post request to API's login route. Returns json web token
exports.login = function(req, res, next){
  var username = req.body.username;
  var password = req.body.password;
  var path = 'http://localhost:5000/';
  //Checking that middleware validators caught no errors.
  const errors = validationResult(req);

  if(errors.isEmpty()){
    //Checks if user exists in database
    User.findOne({username: username}, (err, user)=>{
      //If user is found in db, compare the password in post body to hash in db
      if(user){
        bcrypt.compare(password, user.password, function(err, result){
          if(result){
            console.log("Signed a Json Web Token!");
            jwt.sign({username: username, role:user.role}, 'secretkey420', (err, token) => {
              if(err){
                res.status(400).json({
                  Error: "Error occurred with signing JWT!",
                  links:{
                    all_users_url: 'http://localhost:5000/api/users'
                  }
                });
              }
              res.status(201);
              res.set('Location', path + 'api/users/' + username);
              res.json({
                message: "Login succesful! JSON Web Token granted!",
                JWT: token,
                username: username,
                links:{
                  user_url: 'http://localhost:5000/api/users/'+username,
                  all_users_url: 'http://localhost:5000/api/users'
                }
              })
            });
          }else{
            res.status(401).json({
              Error: "Incorrect password!",
              links:{
                all_users_url: 'http://localhost:5000/api/users'
              }
            });
          }
        });
      }else{
        res.status(401).json({
          Error: "Username does not exist!",
          links:{
            all_users_url: 'http://localhost:5000/api/users'
          }
        });
      }
    });
  }else{
    res.status(400).json({
      Error: "Error occurred!",
      links:{
        all_users_url: 'http://localhost:5000/api/users'
      }
    });
  }
}

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
  //Check if JWT is from an admin. Only admins can add users via REST API for
  //security reasons.
  var authenticated = (req.authData.role == "admin");
  if(authenticated){
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
  }else{
    res.status(401).json({
      error: "Only admins can add users via REST API!",
      links:{
        all_users_url: 'http://localhost:5000/api/users'
      }
    })
  }

}

//Called when updating a specific user's data
exports.update_user = function(req, res, next){
  var param_username = req.params.name;
  var username = req.body.username;
  var password = req.body.password;
  //Check if JWT is from an admin or the correct user.
  var authenticated = (req.authData.role == "admin" ||
                        req.authData.username == param_username);

  if(authenticated){
    //Checking that middleware validators caught no errors.
    const errors = validationResult(req);
    //Check that no errors and user at least specified one field to update
    if(errors.isEmpty() && (username || password || req.body.role)){

      //Check that parameter username exists
      User.findOne({username: param_username}, (err, user2)=>{
        if(err){
          res.status(400).json({
            message: "Error occurred!",
            links:{
              all_users_url: 'http://localhost:5000/api/users'
            }
          })
          return;
        }
        if(!user2){
          res.status(400).json({
            message: "Username not found!",
            links:{
              all_users_url: 'http://localhost:5000/api/users'
            }
          })
          return;
        }else{
          //Check if admin wants to update role for a user
          if(req.body.role && req.authData.role == 'admin'){
            User.updateOne({username: param_username}, {role: req.body.role}, function(err, result){
              if(err){
                res.status(400).json({
                  message: "Error occurred with updating role!",
                  links:{
                    all_users_url: 'http://localhost:5000/api/users'
                  }
                })
                return;
              }
              console.log("Role change successful.");
            });
          }
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
                return;
              }
              //If username is not already taken, in other words it's not found in db.
              if(!user){
                //Change username to the one specified in the post request
                User.updateOne({ username: param_username}, { username: username }, function(err, result) {
                  if(err){
                    res.status(400).json({
                      message: "Error occurred!",
                      links:{
                        all_users_url: 'http://localhost:5000/api/users'
                      }
                    })
                    return;
                  }
                  console.log("Username change successful.");
                });
              }else{
                res.status(409).json({
                  message: "Username already taken!",
                  links:{
                    all_users_url: 'http://localhost:5000/api/users'
                  }
                })
                return;
              }
            });
          }
          //Check if user wants to update password
          if(password){
            //Hash the given password
            bcrypt.hash(password, saltRounds, function(err, hash) {
              if(err){
                res.status(400).json({
                  message: "Error occurred with hashing!",
                  links:{
                    all_users_url: 'http://localhost:5000/api/users'
                  }
                })
                return;
              }
              User.updateOne({username: param_username}, {password: hash}, function(err, result){
                if(err){
                  res.status(400).json({
                    message: "Error occurred with updating password!",
                    links:{
                      all_users_url: 'http://localhost:5000/api/users'
                    }
                  })
                  return;
                }
                console.log("Password change successful.");
              });
            });
          }
          res.status(200).json({
            message: "Updates successful!",
            links:{
              all_users_url: 'http://localhost:5000/api/users'
            }
          })
          return;
        }
      })
    }else{
      res.status(400).json({
        message: "Error occurred!",
        links:{
          all_users_url: 'http://localhost:5000/api/users'
        }
      })
      return;
    }
  }else{
    res.status(401).json({
      error: "Not the same user or an admin!",
      links:{
        all_users_url: 'http://localhost:5000/api/users'
      }
    })
    return;
  }

}

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const model = require('./model');
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

//Renders a view for the front page
exports.front_page = function(req, res, next){
  res.render('front_page.hbs', {registered: req.session.registered, admin: req.session.admin,
                                logged_in: req.session.logged_in});
}

//Renders a view with form for creating a new user account
exports.create_user = function(req, res, next) {
  res.render('create_user');
}

//Method for adding users to MongoDB
//Validates username and password so that both are at least 5 characters long
//and username doesnt already exist in database. Password is encrypted using
//bcrypt.
exports.add_users = function(req, res, next){
  var username = req.body.username;
  var password = req.body.password;

  //Checking that middleware validators in router.js caught no errors.
  const errors = validationResult(req);

  //If parameters are ok, continue with database operations. Otherwise render a validation page.
  if (errors.isEmpty()){

    //If username already exists, inform the user that the username
    //is not available
    User.findOne({username: username}, (err, user)=>{
      if(user){
        res.render('create_user', {message: `${username} already exists. Please choose another one.`});
      }else{
        bcrypt.hash(password, saltRounds, function(err, hash) {
          //Generated hash is saved to the database instead of the actual password
          var new_user = new User({ username: username, password: hash, role: "registered"});
          new_user.save(function (err) {
            if (err) return console.error(err);
            res.render('create_user', {message: "User created successfully!"});
          });
        });
      }
    });
  }else{
    message = "";
    for(x in errors.array()){
      message += errors.array()[x].param + " has " + errors.array()[x].msg + ".  ";
    }
    res.render('create_user', {message});
  }

}

//Renders a page for logging in, redirects to creating an account if users
//doesnt have one already
exports.log_in_page = function(req, res, next){
  res.render('log_in.hbs');
}

exports.log_in_action = function(req, res, next){
  var username = req.body.username;
  var password = req.body.password;

  //Checking that middleware validators in router.js caught no errors.
  const errors = validationResult(req);

  if(errors.isEmpty()){
    //Checks if user exists in database
    User.findOne({username: username}, (err, user)=>{
      //If user is found in db, compare the password in post body to hash in db
      if(user){
        bcrypt.compare(password, user.password, function(err, result){
          if(result){
            req.session.logged_in = true;
            //Grant different access rights depending on role in db
            if(user.role == 'registered'){
              req.session.registered = true;
            }
            if(user.role == 'admin'){
              req.session.registered = true;
              req.session.admin = true;
            }
            res.redirect('/');
          }else{
            res.render('log_in.hbs', {message: "Incorrect password."});
          }
        });
      }else{
        res.render('log_in.hbs', {message: "Username does not exist."});
      }
    });
  }else{
    res.render('log_in.hbs', {message: "Invalid username or password."});
  }
}

exports.log_out = function(req, res, next){
  req.session.destroy(function (err){console.log(err)});
  res.redirect('/');
}

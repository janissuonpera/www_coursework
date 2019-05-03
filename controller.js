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
  res.render('front_page.hbs', {session: req.session});
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

//Action for logging the user in. Checks for validation error and compares
//password to hashed password in db.
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
            req.session.username = username;
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

//Action for logging out. Destroys session and its properties
exports.log_out = function(req, res, next){
  req.session.destroy(function (err){console.log(err)});
  res.redirect('/');
}

//Renders page where users can view their profile information
exports.profile = function(req, res, next){
  res.render('profile.hbs', {session: req.session});
}

//Removes user from db and destroys session
exports.unregister = function(req, res, next){
  User.deleteOne({username: req.session.username}, function(err){
    if(err){return console.log(err)}
  });
  //Destroys session and logs user out. After that the user does not exist anymore
  res.redirect('/logout');
}

//Updates users username or password to database
exports.update_user = function(req, res, next){
  var username = req.body.username;
  var password = req.body.password;

  //Checking that middleware validators in router.js caught no errors.
  const errors = validationResult(req);

  //Instead of erros.isEmpty(), check that at least one parameter is validated
  //because the other one might be undefined if the user only wants to update one
  if(errors.array().length<2){
    if(username){
      User.findOne({username: username}, (err, user)=>{
        if(err){return console.log(err)}
        //If username is not already taken, in other words it's not found in db.
        if(!user){
          //Change username to the one specified in the post request
          User.updateOne({ username: req.session.username }, { username: username }, function(err, result) {
            if(err){return console.log(err)}
            console.log("Username change successful.");
            //Remember to change session username as well.
            req.session.username = username;
            req.session.message = "Update successful!";
            res.redirect('/user/profile');
          });
        }else{
          req.session.message = "Username already taken!";
          res.redirect('/user/profile')
        }
      });
    }else if(password){
      bcrypt.hash(password, saltRounds, function(err, hash) {
        if(err){return console.log(err)}
        User.updateOne({username: req.session.username}, {password: hash}, function(err, result){
          if(err){return console.log(err)}
          console.log("Password change successful.");
          req.session.message = "Update successful!";
          res.redirect('/user/profile');
        });
      });
    }else{
      res.redirect('/profile');
    }
  }else{
    console.log("Username or password invalid.")
    res.redirect('/user/profile');
  }
}

//Renders admin page that only an admin can see. Admins can view and modify
//other users' data on this page.
exports.admin = function(req, res, next){
  User.find({}, function(err, users){
    res.render('admin-page.hbs', {session: req.session, users: users});
  });
}

//Called when admin updates user data in the /admin-pages route
exports.admin_update = function(req, res, next){
  var username = req.body.username;
  var old_username = req.body.old_username;
  var role = req.body.role;
  const errors = validationResult(req);
  //Check for username validation done in router file
  if(username && (errors.isEmpty() || errors.array()[0].value == undefined)){
    //Check that username is not taken
    User.findOne({username: username}, (err, user)=>{
      if(err){return console.log(err)}
      //If username is not already taken, in other words it's not found in db.
      if(!user){
        //Change username to the one specified in the post request
        User.updateOne({ username: old_username }, { username: username }, function(err, result) {
          if(err){return console.log(err)}
          console.log("Username change successful.");
          req.session.message = "Update successful!";
          res.redirect('/admin-page');
        });
      //If admin wants to change role instead of name
      }else if(role){
        User.updateOne({ username: username }, { role: role }, function(err, result) {
          if(err){return console.log(err)}
          console.log("Role change successful.");
          req.session.message = "Update successful!";
          res.redirect('/admin-page');
        });
      }else{
        req.session.message = "Username already taken!";
        res.redirect('/admin-page');
      }
    });
  }else{
    console.log(errors.array());
    req.session.message = "Update failed!";
    res.redirect('/admin-page');
  }
}

//Called when admin wants to remove a user's account from database
exports.admin_delete = function(req, res, next){
  const errors = validationResult(req);
  var username = req.body.username;
  if(errors.isEmpty()){
    User.deleteOne({username: username}, function(err){
      if(err){return console.log(err)}
    });
    console.log("User deleted");
    req.session.message = "Deletion successful!";
    res.redirect('/admin-page');
  }else{
    req.session.message = "Deletion failed!";
    res.redirect('/admin-page');
  }
}

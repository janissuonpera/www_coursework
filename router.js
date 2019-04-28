const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

//Importing the controller from controller.js
const controller = require('./controller');

//Catch /users/new_user route and use controller.create_user to add new user to db
router.get('/user/new_user', controller.create_user);

//Catch post request and validates and sanitizes the body.
router.post('/user/new_user', [check('username').isLength({ min: 5 }), check('password').isLength({ min: 5 }), controller.add_users]);

//Page for logging in
router.get('/user', controller.log_in);

//Catching all other routes and sending 404 not found
router.get('*', function(req, res){
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found! Try /user');
});

module.exports = router;

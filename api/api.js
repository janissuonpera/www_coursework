const express = require('express');
const router = express.Router();
const api_controller = require('./api_controller');
const { check, validationResult } = require('express-validator/check');

//REMEMBER TO USE JWT FOR AUTH

//Return json object of all users
router.get('/users', api_controller.users_list);

//Return json object of one user
router.get('/users/:name', api_controller.single_user);

//Post request to API to add new user to db
router.post('/users', [check('username').isLength({min: 5}).trim().escape(),
                      check('password').isLength({min: 3}).trim().escape(),
                      api_controller.add_user]);

//Patch request to API to update user data
//router.patch('users/:name', api_controller.update_user);

module.exports = router;

const express = require('express');
const router = express.Router();
const api_controller = require('./api_controller');
const { check, validationResult } = require('express-validator/check');
const api_auth = require('./api_auth');

//REMEMBER TO USE JWT FOR AUTH

//Route for logging in, returns JSON Web Token
router.post('/login', [check('username').isLength({min: 5}).trim().escape(),
                      check('password').isLength({min: 3}).trim().escape(),
                      api_controller.login]);

//Return json object of all users
router.get('/users', api_controller.users_list);

//Return json object of one user
router.get('/users/:name', api_controller.single_user);

//Post request to API to add new user to db. Only for admins. Authenticated with JWT
router.post('/users', [api_auth.read_JWT, api_auth.verify_JWT,
                      check('username').isLength({min: 5}).trim().escape(),
                      check('password').isLength({min: 3}).trim().escape(),
                      api_controller.add_user]);

//Patch request to API to update user data. Only for admins. Authenticated with JWT
router.patch('/users/:name', [api_auth.read_JWT, api_auth.verify_JWT,
                             check('username').isLength({min: 5}).trim().escape().optional(),
                             check('password').isLength({min: 3}).trim().escape().optional(),
                             api_controller.update_user]);

module.exports = router;

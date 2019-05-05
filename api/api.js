const express = require('express');
const router = express.Router();
const api_controller = require('./api_controller');
const { check, validationResult } = require('express-validator/check');
const api_auth = require('./api_auth');

//REMEMBER TO USE JWT FOR AUTH

//Route for logging in, returns JSON Web Token
router.post('/login', [check('username').isLength({min: 5}).isString().trim().escape(),
                      check('password').isLength({min: 3}).isString().trim().escape(),
                      api_controller.login]);

//Return json object of all users
router.get('/users', api_controller.users_list);

//Return json object of one user
router.get('/users/:name', api_controller.single_user);

//Post request to API to add new user to db.
router.post('/users', [check('username').isLength({min: 5}).isString().trim().escape(),
                      check('password').isLength({min: 3}).isString().trim().escape(),
                      api_controller.add_user]);

//Patch request to API to update user data. Authenticated with JWT
router.patch('/users/:name', [api_auth.read_JWT, api_auth.verify_JWT,
                             check('username').isLength({min: 5}).isString().trim().escape().optional(),
                             check('password').isLength({min: 3}).isString().trim().escape().optional(),
                             check('cardname').isLength({min: 2}).isString().trim().escape().optional(),
                             check('cardnum').isLength({min: 10}).isString().trim().escape().optional(),
                             check('expdate').isLength({min: 5}).isString().trim().escape().optional(),
                             check('cvv').isLength({min: 3}).isString().trim().escape().optional(),
                             api_controller.update_user]);

//Return json object of one user
router.delete('/users/:name', [api_auth.read_JWT, api_auth.verify_JWT,
                              check('username').isLength({min: 5}).isString().trim().escape().optional(),
                              check('password').isLength({min: 3}).isString().trim().escape().optional(),
                              api_controller.delete_user]);

module.exports = router;

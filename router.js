const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

//Importing the controller from controller.js
const controller = require('./controller');

//Front page of the application, 5 ects version
router.get('/', controller.front_page);

//Route for logging out
router.get('/logout', controller.log_out);

//Route for viewing profile
router.get('/user/profile', controller.profile);

//Route for unregistering
router.get('/user/unregister', controller.unregister);

//Catch /users/new_user route and use controller.create_user to add new user to db
router.get('/user/new_user', controller.create_user);

//Catch post request and validates and sanitizes the body.
router.post('/user/new_user', [check('username').isLength({ min: 5 }).trim().escape(),
                                check('password').isLength({ min: 3 }).trim().escape(),
                                controller.add_users]);

//Catches update request to user route
router.post('/user/update', [check('username').isLength({min: 5}).trim().escape(),
                      check('password').isLength({min: 3}).trim().escape(),
                      controller.update_user])

//Page for logging in
router.get('/user', controller.log_in_page);

//Catches post request to login site, validates and sanitizes the body
router.post('/user',[check('username').isLength({min: 5}).trim().escape(),
                      check('password').isLength({min: 3}).trim().escape(),
                      controller.log_in_action]);

//Catches get request to admin page, where an admin can view and modify user data
router.get('/admin-page', controller.admin);

//Catches updates about users made by admins on admin-page
router.post('/admin-page/update', [check('username').isLength({min: 5}).trim().escape(),
                                  controller.admin_update]);

//Catching all other routes and sending 404 not found
router.get('*', function(req, res){
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found! Try /user');
});



module.exports = router;

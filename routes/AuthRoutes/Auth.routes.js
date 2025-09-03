const express = require('express');
const router = express.Router();
const{Signup,Login} = require('../../controllers/AuthController/Auth.controller');

//Auth middleware
const {authToken} = require('../../middlewares/Auth.middleware');

// Signup route
router.post('/signup',Signup);

// Login route
router.post('/login',Login);

module.exports = router;

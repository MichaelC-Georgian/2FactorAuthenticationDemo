// This is the Router for the 2 Factor Authenticator Method using an SMS Authenticator
var express = require('express');
var router = express.Router();
const User = require('../models/user');

// Middleware function to check if the current user is logged in.
function IsLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('../login');
}

// Step 3: Add the require statement for @vonage/server-sdk and for our globals file


// Step 4: create a Vonage object with your apiKey and apiSecret



// Step 5: create a verify post method



// Step 6 create a check post method



// Step 7a Create our router get method for our /verify page



// Step 7b Create our router get method for our /check page


// Step 8 Create an addPhone post method to handle updating users phone numbers to enable 2fa



//Exports router
module.exports = router;

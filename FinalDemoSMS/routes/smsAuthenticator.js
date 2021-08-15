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
const Vonage = require('@vonage/server-sdk');
const config = require("../config/globals");

// Step 4: create a Vonage object with your apiKey and apiSecret
const vonage = new Vonage({
    apiKey: config.vonage.apiKey,
    apiSecret: config.vonage.apiSecret
});

// Step 7a Create our router get method for our /verify page
//Get handler to handle display of verify page
router.get('/', IsLoggedIn , (req, res, next) => {
    let messages = req.session.messages || [];
    req.session.messages = [];
    res.render('auth/verify', {
        title: '2-Factor SMS Authentication',
        messages: messages,
        user: req.user
    });
});

// Step 7b Create our router get method for our /check page
//Get handler to handle display of check page
router.get('/check',IsLoggedIn, (req, res, next) => {
    let messages = req.session.messages || [];
    req.session.messages = [];
    res.render('loginSuccess', {
        title: '',
        messages: messages,
        user: req.user,
        request_id: req.body.request_id
    });
});

//Step 5: create a verify post method
router.post('/verify',IsLoggedIn, (req, res) => {
    //Makes a request for a verification code, it provides the api with the
    // users phone number, the apps brand, and a workflow ID.
    // The workflow ID corresponds to 1 of 7 behaviours as seen here:
    // https://developer.nexmo.com/verify/guides/workflows-and-events
    // It mainly affects how the API contacts you, call or text, and a
    // repeating pattern depending on the setting
    vonage.verify.request({
        number: req.user.phone,
        brand: '2FA Demo',
        workflow_id: 4
    }, (error, result) => {

        //Check the result of the request method and if theres an error, show it,
        // if not move on to the Check page while  also sending the request_id
        if(result.status != 0 && result.status != 10) {

            res.render('auth/verify', { message: result.error_text, user: req.user })
        } else {
            res.render('auth/check', {
                requestId: result.request_id,
                user: req.user
            })
        }
    })
});

//Step 6 create a check post method
router.post('/check',IsLoggedIn,(req, res, next) =>{
    //Check the request ID against the received code, if its a match, continue, if not, throw errors
    console.log(req.body.requestId);
    console.log(req.body.code);
    vonage.verify.check({
        request_id: req.body.requestId,
        code: req.body.code
    }, (err, result) => {
        if (err) { //If there's an error - log it and send us back to the beginning of the 2 factor authorization process.
           console.log(err);
           res.render('auth/verify', {message: 'Wrong code, please reattempt.', user: req.user});
        } else { //If everything is fine, send the user to the login success page enable the 2fa flag for their login session
            req.session.twoFAAuthenticated = true;
            res.redirect('/loginSuccess');
        }
    });
})

//Step 8 Create an addPhone post method to handle updating users phone numbers to enable 2fa
router.post('/addPhone',IsLoggedIn, (req, res, next) => {
    User.findOneAndUpdate({_id: req.user._id },{
        phone: req.body.phone
    }, (err) => {
        if (err) {
            console.log(err)
        }
        else {
            res.redirect('/auth/');
        }
    });
});

module.exports = router;

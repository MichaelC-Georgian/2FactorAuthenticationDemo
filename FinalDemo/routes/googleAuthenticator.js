var express = require('express');
var router = express.Router();
// importing for Authentication
const User = require('../models/user');



//STEP 3:
// import the required NPM modules
const speakeasy = require("speakeasy");
const { session } = require('passport');

// Middleware function to check if the current user is logged in.
function IsLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

//STEP 4: This step shows the user a QR code to be scanned with Google Authenticator. 
//  A secret key is generated using the speakeasy NPM module.
//   then a QR code is generated (Right now it's being generated as a URL)
//   then the secretKey is saved with the User (currently this is not being encrypted or serialized, it is not a good idea to do this as it's less secure to save in plain text)
//   all of this information is then passed to the googleAuthenticatorView.
/* GET home page. */
router.get('/', IsLoggedIn, function (req, res, next) {

    var encodedKey = speakeasy.generateSecret().base32;
    // generate QR code for scanning into Google Authenticator
    var otpUrl = 'otpauth://totp/' + req.user.username + '?secret=' + encodedKey + '&period=30';
    var qrImage = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + encodeURIComponent(otpUrl);
    
    let messages = req.session.messages || [];
    req.session.messages = [];
    //Render the view passing user, qrimage, messages, and the key
    res.render('googleAuthenticator/index', {
        user: req.user,
        qrImage: qrImage,
        key: encodedKey,
        messages: messages
    });
});

// Step 9: Create Post router for QR code
router.post('/', IsLoggedIn, function (req, res, next) {
    // Get values from the form
    let userToken = req.body.code;
    let base32secret = req.body.key;
    //Using speakeasy to verify the token
    let verified = speakeasy.totp.verify({
        secret: base32secret,
        encoding: 'base32',
        token: userToken
    });
    // verified is a boolean value
    if (verified) {
        // After success update Database entry for the user to include the SecretKey and the twoFAMethod
        User.findOneAndUpdate({
                _id: req.user._id
            }, {
                secretKey: base32secret,
                twoFAMethod: "google"
            },
            function (error, success) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(success);
                }
            });
            req.session.twoFAAuthenticated = true;
            res.redirect('/loginSuccess');
    // IF verification fails redirect user back and save failure message
    } else {
        req.session.messages = ["Incorrect Token Please Try Scanning the QR Code Again and Entering the New Key"];
        res.redirect('/googleAuthenticator/');
    }
});


// STEP 5: Create get router for validateCode view 
// ROUTES FOR VALIDATECODE ------------------------------------|
// GET
router.get('/validateCode', IsLoggedIn, (req, res, next) => {
    res.render('googleAuthenticator/validateCode', {
        title: 'Add Recommendations',
        user: req.user
    });
});



// STEP 6: Create POST router for validateCode view
//  This Step will verify the token using the user's secret key 
// ROUTES FOR VALIDATECODE ------------------------------------|
// POST
router.post('/validateCode', (req, res, next) => {
    let userToken = req.body.code;
    let base32secret = req.user.secretKey;
    //Using speakeasy to verify the token
    let verified = speakeasy.totp.verify({  secret: base32secret,
                                            encoding: 'base32',
                                            token: userToken});
    // verified is a boolean value
    if (verified) {
        req.session.twoFAAuthenticated = true;
        res.redirect('/loginSuccess');
    }
    else {
        res.redirect('/googleAuthenticator/validateCode');
    }
});



module.exports = router;

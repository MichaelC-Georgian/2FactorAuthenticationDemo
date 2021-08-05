var express = require('express');
var router = express.Router();
// importing for Authentication
const User = require('../models/user');
const passport = require('passport');


//STEP 3:
// import the required NPM modules
const speakeasy = require("speakeasy");
const QRCode = require('qrcode');

// Middleware function to check if the current user is logged in.
function IsLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}


//STEP 4:
/* GET home page. */
router.get('/', IsLoggedIn, function (req, res, next) {
    // if (req.user.secretKey) {
    //     // new two-factor setup.  generate and save a secret key
    //     var encodedKey = req.body.secretKey;
    //     //var encodedKey = speakeasy.generateSecret().base32;
    //     // generate QR code for scanning into Google Authenticator
    //     // reference: https://code.google.com/p/google-authenticator/wiki/KeyUriFormat

    //     var otpUrl = 'otpauth://totp/' + req.user.username +
    //         '?secret=' + encodedKey + '&period=30';
    //     var qrImage = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + encodeURIComponent(otpUrl);

    //     res.render('setup', {
    //         user: req.user,
    //         qrImage: qrImage,
    //         key: encodedKey,
    //     });
    // } else {
        // new two-factor setup.  generate and save a secret key

        var encodedKey = speakeasy.generateSecret().base32;
        console.log(encodedKey);
        //secret = speakeasy.generateSecret();
        // generate QR code for scanning into Google Authenticator
        // reference: https://code.google.com/p/google-authenticator/wiki/KeyUriFormat

         var otpUrl = 'otpauth://totp/' + req.user.username +
             '?secret=' + encodedKey + '&period=30';
        var qrImage = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + encodeURIComponent(otpUrl);
        
        //let url = secret.otpauth_url
        
        //let qrImage = encodeURIComponent(url);



        User.findOneAndUpdate({
                _id: req.user._id
            }, {
                secretKey: encodedKey
            },
            function (error, success) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(success);
                }
            });
            
        res.render('twoFactorAuth/index', {
            user: req.user,
            qrImage: qrImage,
            key: encodedKey,
        });
    //}
});


// ROUTES FOR ADD ------------------------------------|
// GET
router.get('/validateCode', IsLoggedIn, (req, res, next) => {
    res.render('twoFactorAuth/validateCode', {
        title: 'Add Recommendations',
        user: req.user
    });
});


// ROUTES FOR ADD ------------------------------------|
// GET
router.post('/validateCode', (req, res, next) => {
    let userToken = req.body.code;
    let base32secret = req.user.secretKey;
    let verified = speakeasy.totp.verify({  secret: base32secret,
                                            encoding: 'base32',
                                            token: userToken});

    if (verified) {
        res.redirect('/twoFactorAuth/twoFactorSuccess');
    }
    else {
        res.redirect('/twoFactorAuth/validateCode');
    }
});

// ROUTES FOR ADD ------------------------------------|
// GET
router.get('/twoFactorSuccess', IsLoggedIn, (req, res, next) => {
    res.render('twoFactorAuth/twoFactorSuccess', {
        title: 'Two Factor Success',
        user: req.user
    });
});


module.exports = router;

var express = require('express');
var router = express.Router();
// importing for Authentication
const User = require('../models/user');
const passport = require('passport');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: '2 Factor Authentication',
    user: req.user
  });
});


// Middleware function to check if the current user is logged in.
function IsLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// Function to check if the current user has authenticated using 2 factor authentication
function IsTwoFactorAuthenticated(req, res, next) {
  if (req.user.twoFAMethod != null) {
    // if two factor authentication IS set up check if user is authenticated
    if (req.session.twoFAAuthenticated) {
      // If user is authenticated allow access
      return next();
    } else {
      // If user is not authenticated redirect to validate code page
      res.redirect('/googleAuthenticator/validateCode');
    }
  } else {
    // if two factor authentication IS NOT set up allow access
    return next();
  }
}


//ROUTES FOR LOGIN SUCCESS PAGE
router.get('/loginSuccess', IsLoggedIn, IsTwoFactorAuthenticated, function (req, res, next) {

    //This is added to tell the user if they have two factor set up or not.
    var subtitle = '';
    if (req.session.twoFAAuthenticated) {
      subtitle = 'You have logged on with two factor authentication!';
    } else {
      subtitle = 'Your two factor authentication is not yet set up. ';
    }

  res.render('loginSuccess', {
    title: 'Login Successful',
    user: req.user,
    subtitle: subtitle
  });
});
// ROUTES FOR LOGIN ---------------------------------|
// GET
router.get('/login', (req, res, next) => {
  let messages = req.session.messages || [];
  req.session.messages = [];
  res.render('login', {
    title: 'Login',
    messages: messages,
    user: req.user
  });
});

// POST
router.post('/login', passport.authenticate('local', {
  successRedirect: '/loginSuccess',
  failureRedirect: '/login',
  failureMessage: 'Invalid Credentials'
}));

// ROUTES FOR REGISTER -----------------------------|
// GET
router.get('/register', (req, res, next) => {
  res.render('register', {
    title: 'Register',
    user: req.user
  });
});

// POST
router.post('/register', (req, res, next) => {
  User.register(
    new User({
      username: req.body.username
    }),
    req.body.password,
    (err, newUser) => {
      if (err) {
        console.log(err);
        return res.redirect('/register');
      } else {
        req.login(newUser, (err) => {
          res.redirect('/loginSuccess');
        });
      }
    });
});

// ROUTES FOR LOGOUT
// GET
router.get('/logout', (req, res, next) => {
  // log user out
  req.logOut();
  req.session.twoFAAuthenticated = false;
  // send user back to login page
  res.redirect('/login');
});

// STEP 8? 
// We will probably include this in the starter file
// ROUTES FOR ACCOUNT
router.get('/account', IsLoggedIn, (req, res, next) => {
  res.render('account', {
    user: req.user
  });
});



module.exports = router;

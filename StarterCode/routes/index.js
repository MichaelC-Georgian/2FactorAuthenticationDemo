var express = require('express');
var router = express.Router();
// importing for Authentication
const User = require('../models/user');
const passport = require('passport');

// Middleware function to check if the current user is logged in.
function IsLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: '2 Factor Authentication',
    user: req.user
  });
});

//ROUTES FOR LOGIN SUCCESS PAGE
router.get('/loginSuccess', IsLoggedIn, function (req, res, next) {
  res.render('loginSuccess', {
    title: 'Login Successful',
    user: req.user,
    verified2FA: req.session.twoFAAuthenticated
  });
});

// LOGIN ROUTES
// GET handler for login page
router.get('/login', (req, res, next) => {
  let messages = req.session.messages || [];
  req.session.messages = [];
  res.render('login', {
    title: 'Login',
    messages: messages,
    user: req.user
  });
});

// POST handler for login page with local authentication.
router.post('/login', passport.authenticate('local', {
  successRedirect: '/auth/',
  failureRedirect: '/login',
  failureMessage: 'Invalid Credentials'
}));


// Register Routes
// GET handler for register page
router.get('/register', (req, res, next) => {
  res.render('register', {
    title: 'Register',
    user: req.user
  });
});

// POST handler for register page that creates a new user and redirects user to restricted content.
router.post('/register', (req, res, next) => {
  User.register(
    new User({
      username: req.body.username,
      phone: req.body.phone
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
    }
  );
});

// ROUTES FOR LOGOUT
// get handler for logout, logs user out and disables 2fa authenticated status.
router.get('/logout', (req, res, next) => {
  // log user out
  req.logOut();
  // Step 9 Set our 2fa session value to false.

  // send user back to login page
  res.redirect('/login');

});

//Export module to the router so its contents can be accessed.
module.exports = router;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//importing Mongoose and config 
const mongoose = require('mongoose');
const config = require('./config/globals');


//STEP 1:
var twoFactorAuthRouter = require('./routes/twoFactorAuth');
var indexRouter = require('./routes/index');
//Authentication
const passport = require('passport');
const session = require('express-session');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Congigure passport session cookie
app.use(session({
  secret: 'Summer20212FATutorial',
  resave: false,
  saveUninitialized: false
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

const User = require('./models/user');
passport.use(User.createStrategy());


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//STEP 2:
app.use('/twoFactorAuth', twoFactorAuthRouter);
app.use('/', indexRouter);

// Connect to MongoDb
mongoose.connect(config.db, {
    useNewUrlparse: true,
    useUnifiedTopology: true
  })
  .then((message) => {
    console.log('Connected Successfully');
  })
  .catch((err) => {
    console.log('Connection Unsuccessful ' + err);
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

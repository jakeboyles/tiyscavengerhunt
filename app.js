const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const index = require('./routes/index');
const users = require('./routes/users');
const steps = require('./routes/steps');
const admin = require('./routes/admin');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
require('dotenv').config();

var app = express();

mongoose.Promise = global.Promise;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

mongoose.connect(process.env.MONGOURL);

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// ROUTING
app.use('/', index);
app.use('/step', steps);
app.use('/admin', admin);

app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new FacebookStrategy({
    clientID: process.env.FBCLIENTID,
    clientSecret: process.env.FBCLIENTSECRET,
    callbackURL: process.env.URL+"/auth/facebook/callback"
  },(accessToken, refreshToken, profile, done) => done(null, profile)));


// Will do something with these l8ter...
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',

passport.authenticate('facebook', 
  { successRedirect: '/step/1',
    failureRedirect: '/',
  })
);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

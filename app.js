const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const mongoose = require('mongoose');
const index = require('./routes/index');
const steps = require('./routes/steps');
const admin = require('./routes/admin');
const User = require('./models/user');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const app = express();

require('dotenv').config();

mongoose.Promise = global.Promise;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

mongoose.connect(process.env.MONGOURL);

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));



app.use(expressSession({
    secret: 'crackalackin',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', index);
app.use('/step', steps);
app.use('/admin', admin);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((user, done) => {
  User.findById(user, (err, user) => {
    done(err, user);
  });
});

passport.use(new FacebookStrategy({
  clientID: process.env.FBCLIENTID,
  clientSecret: process.env.FBCLIENTSECRET,
  callbackURL: process.env.URL+"/auth/facebook/callback"
},(accessToken, refreshToken, profile, done) => {
  User.findOrCreate({fbID:profile.id}, (err, user) => {
      if (err) { return done(err);}
      console.log(profile);
      user.name = profile.displayName;
      user.save();
      done(null, user);
    });
}));;

app.get('/auth/facebook', 
  passport.authenticate('facebook',{ scope: ['public_profile', 'email'] })
);

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', 
  { successRedirect: '/step/1',
    failureRedirect: '/',
  })
);

app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

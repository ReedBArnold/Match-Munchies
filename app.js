/*
    App file for the Express application.
    @author: Melkis Espinal
    Last Edited: 03/24/2017
*/
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('cookie-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

 var mongoose = require('mongoose'),
    assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/matchMunchies';
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected to server!");
});

//create instances of the router modules
var signUpRouter = require('./routes/signUpRouter');
var userRouter = require('./routes/userRouter');
var index = require('./routes/index');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, '/../public'));
//app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({keys: ['secretkey1', 'secretkey2', '...']}));
app.use(express.static(path.join(__dirname, '/../static')));

// Configure passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Configure passport-local to use account model for authentication
var user = require('./models/users');
passport.use(new LocalStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use('/', index);

//mount the routers
app.use('/signup',signUpRouter);
app.use('/user', userRouter);

module.exports = app;
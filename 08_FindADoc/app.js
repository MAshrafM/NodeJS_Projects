var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var cassandra = require('cassandra-driver');

var routes = require('./routes/index');
var doctors = require('./routes/doctors');
var categories = require('./routes/categories');

var app = express();

var client = new cassandra.Client({
    contactPoints:['127.0.0.1']
});

client.connect(function(err, result){
    console.log('Cassandra Connected');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

app.use(flash());

app.use(function(req, res, next){
    res.locals.messages = require('express-messages')(req, res);
    next();
});

var query = "SELECT * FROM findadoc.categories";
client.execute(query, [], function(err, results){
    if (err){
        res.status(404).send({msg:err});
    } else {
        app.locals.cats = results.rows;
    }
});

app.use('/', routes);
app.use('/doctors', doctors);
app.use('/categories', categories);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

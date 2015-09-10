var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var gzipcompress = require('compression');

var routes = {};
routes.index = require('./routes/index');
routes.contact = require('./routes/contact');
routes.feed = require('./routes/feed');

var app = express();

app.use(function(req, res, next) {
  res.removeHeader('X-Powered-By');
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(gzipcompress());
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes.index);
app.use('/contact', routes.contact);
app.use('/feed', routes.feed);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('not found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    if(err.status == 404) {
      res.render('404', {
        message: err.message,
        error: err
      });
    } else {
      res.render('error', {
        message: err.message,
        error: err
      });
    }
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('500.jade', {
    title: '500 Internal Error',
    message: err.message,
    error: {}
  });
});


module.exports = app;

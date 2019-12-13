let fs = require('fs');
let FileStreamRotator = require('file-stream-rotator');
let express = require('express');
let path = require('path');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let logger = require('./logger').logger;

let app = express();

let index = require('./routes/index');
let user = require('./routes/user');
let log = require('./routes/log');

let logDirectory = path.join(__dirname, 'log/morgan')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

let accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: path.join(logDirectory, 'morgan_%DATE%.log'),
  frequency: 'daily',
  verbose: false
})

app.use(morgan('short', {stream: accessLogStream}));
// app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// CORS, 跨域
app.all( '*', function ( req, res, next ) {
  res.set( {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Max-Age': '3600',
    'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Cookie'
    // 'Access-Control-Allow-Headers': '*'
  } );
  next();
});
app.use('/docs/md', index);
app.use('/docs/user', user);
app.use('/docs/log', log);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  next();
});

module.exports = app;

/**
 * A simple enough backend for frontend(http://samnewman.io/patterns/architectural/bff/)
 */
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var utils = require('./common/utils');
var app = express();

// initialize the database
utils.initializeDB();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = require('./controllers/index');
var authRouter = require('./controllers/auth');

// The client app
app.use(express.static('./dist'));

// logging for all routes
app.use(function (req, res, next) {
  console.log('%s %s %s %s', new Date(), req.method, req.url, req.path);
  next();
});

app.use('/api', router);
app.use('/auth', authRouter);

// Error handling
app.use(function (err, req, res, next) {
  if (!err) {
    next();
  }

  console.error(err.stack);
  res.status(500).send({
    'message': 'Internal Server Error'
  });
});

var server = app.listen(port, function () {
  console.log('Server started on port ' + port);
});

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

let connections = [];

server.on('connection', function (connection) {
  connections.push(connection);
  console.log('%s connections currently open', connections.length);
  connection.on('close', function () {
    connections = connections.filter(function (curr) {
      return curr !== connection;
    });
  });
});

function shutDown() {
  console.log('Received kill signal, shutting down gracefully');
  utils.shutdownDB();

  server.close(function () {
    console.log('Closed out remaining connections');
    process.exit(0);
  });

  connections.forEach(function (curr) {
    curr.end();
  });

  setTimeout(function () {
    connections.forEach(function (curr) {
      curr.destroy();
    });
  }, 5000);

  setTimeout(function () {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
}

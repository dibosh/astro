/**
 * A simple enough backend for frontend(http://samnewman.io/patterns/architectural/bff/)
 */
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = require('./controllers/index');

// The client app
app.use(express.static('./dist'));

// CORS Support
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// logging for all routes
app.use(function (req, res, next) {
  console.log('%s %s %s %s', new Date(), req.method, req.url, req.path);
  next();
});

app.use('/api', router);

// Error handling
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send({
    'message': 'Internal Server Error'
  });
});

app.listen(port);
console.log('Server started on port ' + port);

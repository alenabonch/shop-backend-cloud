var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
require('dotenv').config()

const axios = require("axios").default;

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.all('*', async (req, res) => {
  console.log('BFF service handler');

  const recipient = req.originalUrl.split('/')[1];
  const recipientUrl = process.env[recipient];

  if (!recipientUrl) {
    return res.status(502).json({error: 'Cannot process request, recipient not found'});
  }

  const response = await axios({
    method: req.method,
    url: `${recipientUrl}${req.url}`,
    headers: {
      ...req.headers,
      host: new URL(recipientUrl).host,
    }
  });

  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true
  })
  res.status(response.status).json(response.data);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

// Deployed service URL
// http://alenabonch-bff-service.us-east-1.elasticbeanstalk.com/

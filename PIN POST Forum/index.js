
require('dotenv').config();

var express = require('express');

var winston = require('winston');

var app = express();

require('./app')(app);

app.listen(app.get('port'), () => {
    winston.info(`ExpressJS server listening to port ${app.get('port')}`);
});

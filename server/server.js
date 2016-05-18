'use strict';

const express = require('express');
const helmet = require('helmet');
const http = require('http');

const Logger = require('./logger');

const app = express();
const port = process.env.PORT;

if (!port) {
    throw Error('Port should be provided as environment variable')
}

app.use((req, res, next) => {
    Logger.info(req.method + ' ' + req.url);
    next();
});

app.use(helmet());
app.use(express.static(process.cwd() + '/client/dist'));

app.listen(port);

Logger.info('MALViewer is listening on port ' + port);
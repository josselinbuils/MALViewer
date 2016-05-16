'use strict';

const express = require('express');

const Logger = require('./logger');

const app = express();
const port = process.env.PORT;

if (!port) {
    throw Error('Port should be provided as environment variable')
}

app.use(express.static(process.cwd() + '/client/dist'));

app.listen(port);

Logger.info('MALViewer is listening on port ' + port);
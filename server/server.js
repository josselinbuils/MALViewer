'use strict';

const express = require('express');
const http = require('http');
const request = require('request');

const Logger = require('./logger');

const app = express();
const port = process.env.PORT;

if (!port) {
    throw Error('Port should be provided as environment variable')
}

app.get('/get/:url', (req, res) => {
    request(decodeURIComponent(req.params.url), function (error, response, data) {
        if (!error && response.statusCode == 200) {
            res.setHeader('Content-Type', 'image/jpg');
            res.end(data);
        } else {
            res.status(response.statusCode).end(response.statusMessage);
        }
    });
});

app.use(express.static(process.cwd() + '/client/dist'));

app.listen(port);

Logger.info('MALViewer is listening on port ' + port);
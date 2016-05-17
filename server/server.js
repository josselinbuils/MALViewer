'use strict';

const express = require('express');
const http = require('http');

const Logger = require('./logger');

const app = express();
const port = process.env.PORT;

if (!port) {
    throw Error('Port should be provided as environment variable')
}

app.get('/get/:url', (req, res) => {

    let url = decodeURIComponent(req.params.url).match(/(https?:\/\/[^/]*)(.*)/);

    Logger.info('Get ' + url[1] + url[2]);

    let reqConfig = {
        hostname: url[1],
        path: url[2],
        method: 'GET'
    };

    let request = http.request(reqConfig, function (response) {

        let buffer = new Buffer();

        if (response.statusCode === 200) {

            res.writeHead(200, {'Content-Type': response.getHeader('Content-Type')});

            response.on('data', function (data) {
                buffer.write(data, 'binary');
            });

            response.on('end', function () {
                res.end(buffer);
            });

        } else {
            res.status(res.statusCode).end(res.statusMessage);
        }
    });

    request.on('error', function (error) {
        res.status(500).end(error.code);
    });

    request.end();
});

app.use(express.static(process.cwd() + '/client/dist'));

app.listen(port);

Logger.info('MALViewer is listening on port ' + port);
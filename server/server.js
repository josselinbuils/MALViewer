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

    let reqConfig = {
        hostname: url[1],
        path: url[2],
        method: 'GET'
    };

    let request = http.request(reqConfig, function (res) {

        let buffer = new Buffer();

        if (res.statusCode === 200) {

            res.writeHead(200, {'Content-Type': res.getHeader('Content-Type')});

            res.on('data', function (data) {
                buffer.write(data, 'binary');
            });

            res.on('end', function () {
                res.end(buffer);
            });

        } else {
            res.status(res.statusCode).end(res.statusMessage);
        }
    });

    request.on('error', function () {
        res.status(500).end();
    });

    request.end();
});

app.use(express.static(process.cwd() + '/client/dist'));

app.listen(port);

Logger.info('MALViewer is listening on port ' + port);
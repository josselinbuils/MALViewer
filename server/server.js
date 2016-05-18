'use strict';

const express = require('express');
const http = require('http');
const httpProxy = require('http-proxy');

const Logger = require('./logger');

const app = express();
const port = process.env.PORT;

if (!port) {
    throw Error('Port should be provided as environment variable')
}

let proxy = httpProxy.createProxyServer({});
proxy.on('error', error => Logger.error('Proxy error: ' + error.message));

app.get('/get/:url', (req, res) => {

    let url = decodeURIComponent(req.params.url);

    Logger.info('GET ' + url);

    proxy.web(req, res, {
        changeOrigin: true,
        ignorePath: true,
        prependPath: false,
        target: url
    });
});

app.use(express.static(process.cwd() + '/client/dist'));

app.listen(port);

Logger.info('MALViewer is listening on port ' + port);
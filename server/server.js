"use strict";

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';
import socket_io from 'socket.io';

let app = express(),
    port = process.env.DOTS_PORT || 9899,
    server = http.createServer(app),
    io = socket_io(server);

process.stdin.resume();

function exitHandler(options, err) {
    if (options.cleanup) console.log('clean');
    if (err) console.log(err.stack);
    if (options.exit) {
        // connection.end();
        console.log("exiting...");
        process.exit();
    }
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, {cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

app.use(cors());
app.use(morgan(':remote-addr - :remote-user [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms'));
app.use(bodyParser.json());

// connection.connect();

app.use("/scripts", express.static("bower_components"));

app.use("/", express.static("dist/client"));

io.on("connection", socket => {
    socket.emit("init", {
        message: "Success"
    });
    socket.on("message", data => {
        console.log(data);
    });
});

console.log("Starting...");

server.listen(port,() => {
    console.log("Server started.");
});
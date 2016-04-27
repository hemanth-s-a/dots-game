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
// app.use(morgan(':remote-addr - :remote-user [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms'));
app.use(bodyParser.json());

// connection.connect();

app.use("/scripts", express.static("bower_components"));

app.use("/", express.static("dist/client"));

let cloneArray = (oldArray) => {
    let newArray = oldArray.map((innerArray) => {
        return innerArray.map((element) => {
            return element.slice();
        });
    });
},
setArrayElement = (array, i, j, line, addition) => {
    let innerArray = array.slice(i, i+1)[0];
    innerArray = innerArray.slice(0, j).concat(line + addition, innerArray.slice(j+1));
    return array.slice(0, i).concat([innerArray], array.slice(i+1));
},
game = {}, height = 8, width = 8,
setupGame = () => {
    game.horizontal = [];
    game.vertical = [];
    game.boxes = [];
    game.turn = "Blue";

    for(let i = 0; i <= height; i++) {
        game.horizontal[i] = [];
        for(let j = 0; j < width; j++) {
            game.horizontal[i][j] = "hLine";
        }
    }

    for(let i = 0; i < height; i++) {
        game.vertical[i] = [];
        for(let j = 0; j <= width; j++) {
            game.vertical[i][j] = "vLine";
        }
    }

    for(let i = 0; i < height; i++) {
        game.boxes[i] = [];
        for(let j = 0; j < width; j++) {
            game.boxes[i][j] = "box";
        }
    }
},
checkAndUpdateBoxes = (data) => {
    let flag = true, row = data.row, column = data.column;
    if (data.row == 0) {
        if (data.column == 0) {
            if (data.lineType == "hLine") {
                if (game.horizontal[row+1][column].indexOf("Black") > -1
                    && game.vertical[row][column].indexOf("Black") > -1
                    && game.vertical[row][column+1].indexOf("Black") > -1) {
                    game.boxes[row][column] += game.turn;
                    return false;
                }
            } else {
                if (game.horizontal[row][column].indexOf("Black") > -1
                    && game.horizontal[row+1][column].indexOf("Black") > -1
                    && game.vertical[row][column+1].indexOf("Black") > -1) {
                    game.boxes[row][column] += game.turn;
                    return false;
                }
            }
        } else if (data.column == width) {
            /**
             * Has to be vertical
             */
            if (game.horizontal[row][column-1].indexOf("Black") > -1
                && game.horizontal[row+1][column-1].indexOf("Black") > -1
                && game.vertical[row][column-1].indexOf("Black") > -1) {
                game.boxes[row][column-1] += game.turn;
                return false;
            }
        } else {
            if (data.lineType == "hLine") {
                if (game.horizontal[row+1][column].indexOf("Black") > -1
                    && game.vertical[row][column].indexOf("Black") > -1
                    && game.vertical[row][column+1].indexOf("Black") > -1) {
                    game.boxes[row][column] += game.turn;
                    return false;
                }
            } else {
                if (game.horizontal[row][column].indexOf("Black") > -1
                    && game.horizontal[row+1][column].indexOf("Black") > -1
                    && game.vertical[row][column+1].indexOf("Black") > -1) {
                    game.boxes[row][column] += game.turn;
                    flag = false;
                }
                if (game.horizontal[row][column].indexOf("Black") > -1
                    && game.horizontal[row+1][column].indexOf("Black") > -1
                    && game.vertical[row][column-1].indexOf("Black") > -1) {
                    game.boxes[row][column-1] += game.turn;
                    flag = false;
                }
            }
        }
    } else if (data.row == height) {
        /**
         * Has to be horizontal
         */
        if (data.column == 0) {
            if (game.horizontal[row-1][column].indexOf("Black") > -1
                && game.vertical[row-1][column].indexOf("Black") > -1
                && game.vertical[row-1][column+1].indexOf("Black") > -1) {
                game.boxes[row-1][column] += game.turn;
                return false;
            }
        } else {
            if (game.horizontal[row-1][column].indexOf("Black") > -1
                && game.vertical[row-1][column].indexOf("Black") > -1
                && game.vertical[row-1][column+1].indexOf("Black") > -1) {
                game.boxes[row-1][column] += game.turn;
                return false;
            }
        }
    } else {
        if (data.column == 0) {
            if (data.lineType == "hLine") {
                if (game.horizontal[row-1][column].indexOf("Black") > -1
                    && game.vertical[row-1][column].indexOf("Black") > -1
                    && game.vertical[row-1][column+1].indexOf("Black") > -1) {
                    game.boxes[row-1][column] += game.turn;
                    flag = false;
                }
                if (game.horizontal[row][column].indexOf("Black") > -1
                    && game.vertical[row][column].indexOf("Black") > -1
                    && game.vertical[row][column+1].indexOf("Black") > -1) {
                    game.boxes[row][column] += game.turn;
                    flag = false;
                }
            } else {
                if (game.horizontal[row][column].indexOf("Black") > -1
                    && game.horizontal[row+1][column].indexOf("Black") > -1
                    && game.vertical[row][column+1].indexOf("Black") > -1) {
                    game.boxes[row][column] += game.turn;
                    return false;
                }
            }
        } else if (data.column == width) {
            /**
             * Has to be vertical
             */
            if (game.horizontal[row][column-1].indexOf("Black") > -1
                && game.horizontal[row+1][column-1].indexOf("Black") > -1
                && game.vertical[row][column-1].indexOf("Black") > -1) {
                game.boxes[row][column-1] += game.turn;
                return false;
            }
        } else {
            if (data.lineType == "hLine") {
                if (game.horizontal[row-1][column].indexOf("Black") > -1
                    && game.vertical[row-1][column].indexOf("Black") > -1
                    && game.vertical[row-1][column+1].indexOf("Black") > -1) {
                    game.boxes[row-1][column] += game.turn;
                    flag = false;
                }
                if (game.horizontal[row][column].indexOf("Black") > -1
                    && game.vertical[row][column].indexOf("Black") > -1
                    && game.vertical[row][column+1].indexOf("Black") > -1) {
                    game.boxes[row][column] += game.turn;
                    flag = false;
                }
            } else {
                if (game.horizontal[row][column].indexOf("Black") > -1
                    && game.horizontal[row+1][column].indexOf("Black") > -1
                    && game.vertical[row][column+1].indexOf("Black") > -1) {
                    game.boxes[row][column] += game.turn;
                    flag = false;
                }
                if (game.horizontal[row][column].indexOf("Black") > -1
                    && game.horizontal[row+1][column].indexOf("Black") > -1
                    && game.vertical[row][column-1].indexOf("Black") > -1) {
                    game.boxes[row][column-1] += game.turn;
                    flag = false;
                }
            }
        }
    }
    return flag;
},
makeMove = (data, color) => {
    if (game.turn !== color) {
        return;
    }
    switch(data.lineType) {
        case "hLine":
            game.horizontal = setArrayElement(
                    game.horizontal,
                    data.row, data.column, data.lineType, "Black");
            break;
        case "vLine":
            game.vertical = setArrayElement(
                    game.vertical,
                    data.row, data.column, data.lineType, "Black");
            break;
    }
    if (checkAndUpdateBoxes(data)) {
        game.turn = (game.turn === "Blue" ? "Red" : "Blue");
    }
};

io.on("connection", socket => {
    socket.emit("init", {
        message: "Success"
    });
    socket.on("message", data => {
        console.log(data);
    });
    socket.on("Blue", data => {
        if (data === "start") {
            setupGame();
        } else {
            makeMove(data, "Blue");
        }
        io.emit("client", game);
        console.log("Game blue");
    });
    socket.on("Red", data => {
        if (data === "start") {
            setupGame();
        } else {
            makeMove(data, "Red");
        }
        io.emit("client", game);
        console.log("Game red");
    });
});

console.log("Starting...");

server.listen(port,() => {
    console.log("Server started.");
});
"use strict";

import io from "socket.io-client";
import React from "react";
import ReactDOM from "react-dom";
import DotsGrid from "./components/dotsGrid.jsx";
import $ from "jquery";

let socket = io.connect(),
game = {},
width = 8, height = 8;

game.horizontal = [];
game.vertical = [];
game.boxes = [];

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

socket.on("init", data => {
    console.log(data);
});

socket.emit("message", {
    value: "sending message"
});

function render() {
    ReactDOM.render(
        React.createElement(DotsGrid, {
            width: 8,
            height: 8,
            game: game,
            drawLine: drawLine.bind(game)
        }),
        document.querySelector("main"));
};

let drawLine = function() {

};

$("input[name='color']").change(function() {
    game.color = this.value;
    $("#inputBox").remove();
    render();
});
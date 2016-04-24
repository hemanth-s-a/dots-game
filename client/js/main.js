"use strict";

import io from "socket.io-client";
import React from "react";
import ReactDOM from "react-dom";
import DotsGrid from "./components/dotsGrid.jsx";

let socket = io.connect();

socket.on("init", data => {
    console.log(data);
});

socket.emit("message", {
    value: "sending message"
});

ReactDOM.render(
    React.createElement(DotsGrid, {
        width: 8,
        height: 8
    }),
    document.querySelector("main"));
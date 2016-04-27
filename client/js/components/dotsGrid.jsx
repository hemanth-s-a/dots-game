"use strict";

import io from "socket.io-client";
import React from "react";
import Row from "./row.jsx";

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            horizontal: this.props.game.horizontal,
            vertical: this.props.game.vertical,
            boxes: this.props.game.boxes,
            color: this.props.game.color,
            turn: this.props.game.turn
        };
        this.renderRow = this.renderRow.bind(this);
        this.click = this.click.bind(this);
        this.setArrayElement = this.setArrayElement.bind(this);
        this.socket = io.connect();
        this.setupConnection();
    }

    setupConnection() {
        this.socket.emit(this.state.color, "start");
        this.socket.on("client", (data) => {
            console.log("Recieved " + this.state.color);
            this.setState({
                horizontal: data.horizontal,
                vertical: data.vertical,
                boxes: data.boxes,
                turn: data.turn
            });
        });
    }

    cloneArray(oldArray) {
        let newArray = oldArray.map((innerArray) => {
            return innerArray.map((element) => {
                return element.slice();
            });
        });
    }

    renderRow(i, clickAction, width, firstPart, secondPart) {
        return <Row key={i}
            clickAction={clickAction}
            width={width}
            turn={this.state.turn}
            hoverColor={this.props.game.color}
            rowFirstPart={firstPart}
            rowSecondPart={secondPart} />;
    }

    setArrayElement(array, i, j, line, addition) {
        let innerArray = array.slice(i, i+1)[0];
        innerArray = innerArray.slice(0, j).concat(line + addition, innerArray.slice(j+1));
        return array.slice(0, i).concat([innerArray], array.slice(i+1));
    }

    click(row, column, lineTypeParameter, event) {
        if (lineTypeParameter.indexOf("Black") > -1) {
            return;
        }
        let lineType = lineTypeParameter.replace(this.state.color, "");
        if (this.state.turn !== this.state.color
            && !(lineType == "vLine" || lineType == "hLine")) {
            return;
        }
        console.log("a");
        this.socket.emit(this.state.color, {
            row: row,
            column: column,
            lineType: lineType
        });
    }

    render() {
        let gridRows = [], i;
        for(i = 0; i < this.props.height; i++) {
            gridRows.push(this.renderRow((i*2),
                this.click.bind(null, i),
                this.props.width,
                null,
                this.state.horizontal[i]));
            gridRows.push(this.renderRow((i*2+1),
                this.click.bind(null, i),
                this.props.width,
                this.state.vertical[i],
                this.state.boxes[i]));
        }
        gridRows.push(this.renderRow((i*2),
            this.click.bind(null, i),
            this.props.width,
            null,
            this.state.horizontal[i]));
        return <table className="dotsGrid">
            <tbody>
                {gridRows}
            </tbody>
        </table>;
    }
};

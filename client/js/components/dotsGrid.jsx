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
            boxes: this.props.game.boxes
        };
        this.renderRow = this.renderRow.bind(this);
        this.click = this.click.bind(this);
        this.setArrayElement = this.setArrayElement.bind(this);
        this.socket = io.connect();
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
            hoverColor={this.props.game.color}
            rowFirstPart={firstPart}
            rowSecondPart={secondPart} />;
    }

    setArrayElement(array, i, j, line, addition) {
        let innerArray = array.slice(i, i+1)[0];
        innerArray = innerArray.slice(0, j).concat(line + addition, innerArray.slice(j+1));
        return array.slice(0, i).concat([innerArray], array.slice(i+1));
    }

    click(row, column, lineType, event) {
        console.log("a");
        switch(lineType) {
            case "hLine":
                this.setState({
                    horizontal: this.setArrayElement(
                        this.state.horizontal,
                        row, column, lineType, "Black")
                });
                break;
            case "vLine":
                this.setState({
                    vertical: this.setArrayElement(
                        this.state.vertical,
                        row, column, lineType, "Black")
                });
                break;
        }
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

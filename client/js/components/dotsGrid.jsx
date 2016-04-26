"use strict";

import React from "react";
import Row from "./row.jsx";

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.renderRow = this.renderRow.bind(this);
        this.click = this.click.bind(this);
    }

    renderRow(i, clickAction, width, firstPart, secondPart) {
        return <Row key={i}
            clickAction={clickAction}
            width={width}
            hoverColor={this.props.game.color}
            rowFirstPart={firstPart}
            rowSecondPart={secondPart} />;
    }

    click(row, column, lineType, event) {

    }

    render() {
        let gridRows = [], i;
        for(i = 0; i < this.props.height; i++) {
            gridRows.push(this.renderRow((i*2),
                this.click.bind(null, i),
                this.props.width,
                null,
                this.props.game.horizontal[i]));
            gridRows.push(this.renderRow((i*2+1),
                this.click.bind(null, i),
                this.props.width,
                this.props.game.vertical[i],
                this.props.game.boxes[i]));
        }
        gridRows.push(this.renderRow((i*2),
            this.click.bind(null, i),
            this.props.width,
            null,
            this.props.game.horizontal[i]));
        return <table className="dotsGrid">
            <tbody>
                {gridRows}
            </tbody>
        </table>;
    }
};

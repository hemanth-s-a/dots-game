"use strict";

import React from "react";
import Dot from "./dot.jsx";
import Constants from "./constants";

export default class extends React.Component {
    constructor(props) {
        super(props);
    }

    renderCells(i, clickAction, cellState) {
        return <td key={i}>
            <Dot dotState={cellState}
                clickAction={clickAction}
                hoverColor={this.props.hoverColor} />
        </td>;
    }

    render() {
        let rows = [], i;
        for(i = 0; i < this.props.width; i++) {
            rows.push(this.renderCells((i*2), this.props.clickAction.bind(null, i),
                this.props.rowFirstPart ? this.props.rowFirstPart[i] : null));
            rows.push(this.renderCells((i*2+1), this.props.clickAction.bind(null, i),
                this.props.rowSecondPart ? this.props.rowSecondPart[i] : null));
        }
        rows.push(this.renderCells((i*2), this.props.clickAction.bind(null, i),
                this.props.rowFirstPart ? this.props.rowFirstPart[i] : null));
        return <tr>{rows}</tr>;
    }
};
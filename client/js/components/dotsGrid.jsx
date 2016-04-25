"use strict";

import React from "react";
import Row from "./row.jsx";

export default class extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let gridRows = [], i,
        horizontalProps = [{
            imageState: "black",
            cssClass: "dot"
        }, {
            imageState: "blank",
            cssClass: "horizontalLine"
        }],
        verticalProps = [{
            imageState: "blank",
            cssClass: "verticalLine"
        }, {
            imageState: "blank",
            cssClass: "box"
        }];
        for(i = 0; i < this.props.height; i++) {
            gridRows.push(<Row key={i*2} keyValue={i*2} width={this.props.width} drawProps={horizontalProps} />);
            gridRows.push(<Row key={i*2+1} keyValue={i*2+1} width={this.props.width} drawProps={verticalProps} />);
        }
        gridRows.push(<Row key={i*2} keyValue={i*2} width={this.props.width} drawProps={horizontalProps} />);
        return <table className="dotsGrid">
            <tbody>
                {gridRows}
            </tbody>
        </table>;
    }
}

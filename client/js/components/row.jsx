"use strict";

import React from "react";
import Dot from "./dot.jsx";

export default class extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let rows = [], i;
        for(i = 0; i < this.props.width; i++) {
            rows.push(<td key={i*2}>
                <Dot keyValue={i*2}
                    imageState={this.props.drawProps[0].imageState}
                    cssClass={this.props.drawProps[0].cssClass} />
                </td>);
            rows.push(<td key={i*2+1}>
                <Dot keyValue={i*2+1}
                    imageState={this.props.drawProps[1].imageState}
                    cssClass={this.props.drawProps[1].cssClass} />
                </td>);
        }
        rows.push(<td key={i*2}>
            <Dot keyValue={i*2}
                imageState={this.props.drawProps[0].imageState}
                cssClass={this.props.drawProps[0].cssClass} />
            </td>);
        return <tr>{rows}</tr>;
    }
};
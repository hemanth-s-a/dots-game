"use strict";

import React from "react";
import Dot from "./dot.jsx"

export default class extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let gridRows = [];
        for(let i = 0; i <= this.props.width; i++) {
            let horizontal = [], vertical = [];
            for(let j = 0; j <= this.props.height; j++) {
                horizontal.push(<td>
                    <Dot imageState="black" cssClass="dot" />
                    </td>);
            }
            gridRows[i*2] = horizontal;
            gridRows[i*2+1] = vertical;
        }
        return <table>
            <tbody>
                {}
            </tbody>
        </table>;
    }
}

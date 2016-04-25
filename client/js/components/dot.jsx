"use strict";

import React from "react";

export default class extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let imageState;
        switch(this.props.imageState) {
            case "black":
                imageState = "/black.gif";
                break;
            case "blank":
                imageState = "/blank.gif";
                break;
            case "red":
                imageState = "/red.gif";
                break;
            case "blue":
                imageState = "/blue.gif";
                break;
            default:
                imageState = "/blank.gif";
        }
        return <img key={this.props.keyValue} src={"/images" + imageState} className={this.props.cssClass} />;
    }
}
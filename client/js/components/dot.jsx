"use strict";

import React from "react";
import classNames from "classnames";
import Constants from "./constants";

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dotState: (this.props.dotState ? this.props.dotState : "dot")
        }
        if (Constants[this.state.dotState].fixed) {
            this.state.fixed = true;
        }

        this.mouseOver = this.mouseOver.bind(this);
        this.mouseOut = this.mouseOut.bind(this);
        this.click = this.click.bind(this);
    }

    mouseOver() {
        if (Constants[this.state.dotState].fixed) {
            return;
        }
        this.setState({
            dotState: this.state.dotState + this.props.hoverColor
        });
    }

    mouseOut() {
        if (Constants[this.state.dotState].fixed) {
            return;
        }
        this.setState({
            dotState: this.state.dotState.replace(this.props.hoverColor, "")
        });
    }

    click(e) {

    }

    render() {
        let classes = classNames({
            [Constants[this.state.dotState].cssClass]: true,
            [Constants[this.state.dotState].imageState]: true
        });
        return <div className={classes}
            onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}
            onClick={this.click}>
        </div>;
    }
}
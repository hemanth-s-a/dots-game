"use strict";

import React from "react";
import classNames from "classnames";
import Constants from "./constants";

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dotState: (props.dotState ? props.dotState : "dot")
        }

        this.mouseOver = this.mouseOver.bind(this);
        this.mouseOut = this.mouseOut.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.dotState != this.state.dotState) {
            this.setState({
                dotState: (newProps.dotState ? newProps.dotState : "dot")
            });
        }
    }

    mouseOver() {
        if (Constants[this.state.dotState].fixed || this.props.turn !== this.props.hoverColor) {
            return;
        }
        this.setState({
            dotState: this.state.dotState + this.props.hoverColor
        });
    }

    mouseOut() {
        if (Constants[this.state.dotState].fixed || this.props.turn !== this.props.hoverColor) {
            return;
        }
        this.setState({
            dotState: this.state.dotState.replace(this.props.hoverColor, "")
        });
    }

    render() {
        let classes = classNames({
            [Constants[this.state.dotState].cssClass]: true,
            [Constants[this.state.dotState].imageState]: true
        });
        return <div className={classes}
            onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}
            onClick={this.props.clickAction.bind(null,
                this.state.dotState)}>
        </div>;
    }
}

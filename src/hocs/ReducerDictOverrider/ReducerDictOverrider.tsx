import React, { Component } from "react";
import PropTypes from "prop-types";

export default class ReducerDictOverrider extends Component {
  static propTypes = {
    reducerDict: PropTypes.object,
    children: PropTypes.element
  };
  static childContextTypes = {
    arenaReducerDict: PropTypes.object
  };
  getChildContext() {
    return {
      arenaReducerDict: this.props.reducerDict
    };
  }
  render() {
    return this.props.children;
  }
}

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Redirect, Switch } from "react-router-dom";

export default class ArenaRedirect extends Component {
  static propTypes = {
    exact: PropTypes.bool,
    push: PropTypes.bool,
    from: PropTypes.string,
    to: PropTypes.string.isRequired
  };

  render() {
    let { exact, from, to, push } = this.props;
    return <Redirect exact={exact} from={from} push={push} to={to} />;
  }
}
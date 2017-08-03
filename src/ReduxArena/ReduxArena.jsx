import React, { Component } from "react";
import PropTypes from "prop-types";
import { Router, Switch } from "react-router-dom";
import createHistory from "history/createBrowserHistory";

export default class ReduxArena extends Component {
  componentWillMount() {
    this.history = createHistory(this.props);
    this.props.setArenaHistory(this.history);
  }

  render() {
    return (
      <Router history={this.history}>
        <Switch>
          {this.props.children}
        </Switch>
      </Router>
    );
  }
}

ReduxArena.propTypes = {
  basename: PropTypes.string,
  forceRefresh: PropTypes.bool,
  getUserConfirmation: PropTypes.func,
  keyLength: PropTypes.number,
  children: PropTypes.any
};
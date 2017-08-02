import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { Router, Switch } from "react-router-dom";
import createHistory from "history/createBrowserHistory";
import * as actions from "./redux/actions";
import { connect } from "react-redux";

class ReduxArena extends Component {
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(null, mapDispatchToProps)(ReduxArena);

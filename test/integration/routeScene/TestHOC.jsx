import React, { Component } from "react";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { ArenaSwitch, RouteScene } from "../../../src";

export default class TestHOC extends Component {
  static propTypes = {
    store: PropTypes.any.isRequired,
    history: PropTypes.any.isRequired,
    pageABundle: PropTypes.object,
    pageAAscyncBundle: PropTypes.any,
    pageBBundle: PropTypes.object,
    pageBAscyncBundle: PropTypes.any
  };

  render() {
    let props = this.props;
    return (
      <Provider store={props.store}>
        <Router history={props.history}>
          <ArenaSwitch reducerKey={props.reducerKey}>
            <RouteScene
              path="/pageA"
              sceneBundle={props.pageABundle}
              asyncSceneBundle={props.pageAAscyncBundle}
              reducerKey={props.pageAReducerKey}
            />
            <RouteScene
              path="/pageB"
              sceneBundle={props.pageBBundle}
              asyncSceneBundle={props.pageBAscyncBundle}
              reducerKey={props.pageBReducerKey}
            />
          </ArenaSwitch>
        </Router>
      </Provider>
    );
  }
}

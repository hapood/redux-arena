import React, { Component } from "react";
import PropTypes from "prop-types";
import { Router, Switch } from "react-router-dom";
import createHistory from "history/createBrowserHistory";
import {
  SCENESWITCH_INIT_SAGA,
  SCENESWITCH_KILL_SAGA
} from "../redux/actionTypes";
import createSenceSwitchReducer from "../redux/reducers/createSenceSwitchReducer";

export default class SceneSwitch extends Component {
  static contextTypes = {
    store: PropTypes.any
  };

  static childContextTypes = {
    sceneSwitchKey: PropTypes.string
  };

  componentWillMount() {
    let flag = this.context.store.addReducer({
      reducerKey: [this.props.reducerKey],
      reducer: createSenceSwitchReducer(this.props.reducerKey)
    });
    if (flag === false)
      throw new Error(
        `Reducer key [${this.props.reducerKey}] is already exsited.`
      );
    this.sagaTaskPromise = new Promise(resolve =>
      this.context.store.dispatch({
        type: SCENESWITCH_INIT_SAGA,
        reducerKey: this.props.reducerKey,
        setSagaTask: resolve
      })
    );
  }

  componentWillUnMount() {
    this.context.store.dispatch({
      type: SCENESWITCH_KILL_SAGA,
      sagaTaskPromise: this.sagaTaskPromise
    });
    this.context.store.removeReducer(this.props.reducerKey);
  }

  getChildContext() {
    return { sceneSwitchKey: this.props.sceneSwitchKey };
  }

  render() {
    return (
      <Switch>
        {this.props.children}
      </Switch>
    );
  }
}

SceneSwitch.propTypes = {
  children: PropTypes.any,
  reducerKey: PropTypes.string
};

SceneSwitch.defaultProps = {
  reducerKey: "sceneSwitch"
};

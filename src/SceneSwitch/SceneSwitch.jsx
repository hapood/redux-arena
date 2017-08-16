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
  componentWillMount() {
    window.arenaStore.replaceReducers({
      [this.props.sceneSwitchKey]: createSenceSwitchReducer(
        this.props.sceneSwitchKey
      )
    });
    this.sagaTaskPromise = new Promise(resolve =>
      window.arenaStore.dispatch({
        type: SCENESWITCH_INIT_SAGA,
        sceneSwitchKey: this.props.sceneSwitchKey,
        setSagaTask: resolve
      })
    );
  }

  componentWillUnMount() {
    window.arenaStore.dispatch({
      type: SCENESWITCH_KILL_SAGA,
      sagaTaskPromise: this.sagaTaskPromise
    });
    window.arenaStore.removeReducers([this.props.sceneSwitchKey]);
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
  sceneSwitchKey: PropTypes.string
};

SceneSwitch.childContextTypes = {
  sceneSwitchKey: PropTypes.string
};

SceneSwitch.defaultProps = {
  sceneSwitchKey: "sceneSwitch"
};

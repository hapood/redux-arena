import React, { Component } from "react";
import PropTypes from "prop-types";
import { Router, Switch } from "react-router-dom";
import createHistory from "history/createBrowserHistory";
import {
  SCENESWITCH_INIT_SAGA,
  SCENESWITCH_KILL_SAGA
} from "../redux/actionTypes";
import createSenceSwitchReducer from "../redux/reducers/createSenceSwitchReducer";
import { addReducer } from "../utils";

export default class SceneSwitch extends Component {
  static contextTypes = {
    store: PropTypes.any
  };

  static childContextTypes = {
    sceneSwitchCtx: PropTypes.object
  };

  static propTypes = {
    children: PropTypes.any,
    reducerKey: PropTypes.string
  };

  componentWillMount() {
    let reducerKey = addReducer(
      this.context.store,
      this.props.reducerKey,
      createSenceSwitchReducer
    );
    let sceneSwitchCtx = { reducerKey };
    this.state = {
      sceneSwitchCtx: sceneSwitchCtx,
      sagaTaskPromise: new Promise(resolve =>
        this.context.store.dispatch({
          type: SCENESWITCH_INIT_SAGA,
          sceneSwitchCtx,
          setSagaTask: resolve
        })
      )
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let { reducerKey } = nextProps;
    if (
      reducerKey != null &&
      reducerKey !== this.state.sceneSwitchCtx.reducerKey
    ) {
      reducerKey = removeAndSetReducer(
        this.context.store,
        this.state.sceneSwitchCtx.reducerKey,
        reducerKey,
        createSenceSwitchReducer
      );
      this.state.sceneSwitchCtx.reducerKey = reducerKey;
    }
  }

  componentWillUnmount() {
    this.context.store.dispatch({
      type: SCENESWITCH_KILL_SAGA,
      sagaTaskPromise: this.state.sagaTaskPromise
    });
    this.context.store.removeReducer(this.state.sceneSwitchCtx.reducerKey);
  }

  getChildContext() {
    return { sceneSwitchCtx: this.state.sceneSwitchCtx };
  }

  render() {
    return (
      <Switch location={this.props.location}>
        {this.props.children}
      </Switch>
    );
  }
}

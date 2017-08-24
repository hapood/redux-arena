import React, { Component } from "react";
import PropTypes from "prop-types";
import { Router, Switch } from "react-router-dom";
import createHistory from "history/createBrowserHistory";
import {
  ARENASWITCH_INIT_SAGA,
  ARENASWITCH_KILL_SAGA
} from "../redux/actionTypes";
import createArenaSwitchReducer from "../redux/reducers/createArenaSwitchReducer";
import { addReducer, removeAndAddReducer } from "../utils";

export default class ArenaSwitch extends Component {
  static contextTypes = {
    store: PropTypes.any
  };

  static childContextTypes = {
    arenaSwitchReducerKey: PropTypes.string
  };

  static propTypes = {
    children: PropTypes.any,
    reducerKey: PropTypes.string
  };

  componentWillMount() {
    let reducerKey = addReducer(
      this.context.store,
      this.props.reducerKey,
      createArenaSwitchReducer
    );
    this.state = {
      arenaSwitchReducerKey: reducerKey,
      sagaTaskPromise: new Promise(resolve =>
        this.context.store.dispatch({
          type: ARENASWITCH_INIT_SAGA,
          reducerKey,
          setSagaTask: resolve
        })
      )
    };
  }
  /**
   * 
   * 
   * @param {any} nextProps 
   * @param {any} nextContext 
   * @memberof ArenaSwitch
   */
  componentWillReceiveProps(nextProps, nextContext) {
    let { reducerKey } = nextProps;
    if (reducerKey != null && reducerKey !== this.state.arenaSwitchReducerKey) {
      this.context.store.dispatch({
        type: ARENASWITCH_KILL_SAGA,
        sagaTaskPromise: this.state.sagaTaskPromise
      });
      reducerKey = removeAndAddReducer(
        this.context.store,
        this.state.arenaSwitchReducerKey,
        reducerKey,
        createArenaSwitchReducer
      );
      this.state = {
        arenaSwitchReducerKey: reducerKey,
        sagaTaskPromise: new Promise(resolve =>
          this.context.store.dispatch({
            type: ARENASWITCH_INIT_SAGA,
            reducerKey,
            setSagaTask: resolve
          })
        )
      };
    }
  }

  componentWillUnmount() {
    this.context.store.dispatch({
      type: ARENASWITCH_KILL_SAGA,
      sagaTaskPromise: this.state.sagaTaskPromise
    });
    this.context.store.removeReducer(this.state.arenaSwitchReducerKey);
  }

  getChildContext() {
    return { arenaSwitchReducerKey: this.state.arenaSwitchReducerKey };
  }

  render() {
    return (
      <Switch location={this.props.location}>
        {this.props.children}
      </Switch>
    );
  }
}

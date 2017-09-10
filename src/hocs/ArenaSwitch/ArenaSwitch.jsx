import React, { Component } from "react";
import PropTypes from "prop-types";
import { Router, Switch } from "react-router-dom";
import createHistory from "history/createBrowserHistory";
import {
  ARENA_SWITCH_INIT_SAGA,
  ARENA_SWITCH_CLEAR_REDUX
} from "../../core/actionTypes";
import createArenaSwitchReducer from "../../core/reducers/createArenaSwitchReducer";
import {
  switchAddReducer,
  switchRmAndAddReducer,
  calcSwitchReducerDict
} from "../../utils";

export default class ArenaSwitch extends Component {
  static contextTypes = {
    store: PropTypes.any,
    arenaReducerDict: PropTypes.object
  };

  static childContextTypes = {
    arenaReducerDict: PropTypes.object,
    arenaSwitchDictItem: PropTypes.object
  };

  static propTypes = {
    children: PropTypes.any,
    reducerKey: PropTypes.string,
    vReducerKey: PropTypes.string
  };

  componentWillMount() {
    let reducerKey = switchAddReducer(
      this.context.store,
      this.props.reducerKey,
      createArenaSwitchReducer
    );
    let arenaReducerDict = calcSwitchReducerDict(
      this.context.arenaReducerDict,
      reducerKey,
      this.props.vReducerKey
    );
    this.state = {
      arenaReducerDict,
      sagaTaskPromise: new Promise(resolve =>
        this.context.store.dispatch({
          type: ARENA_SWITCH_INIT_SAGA,
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
    let { reducerKey, vReducerKey } = nextProps;
    let refreshFlag = false;
    let newReducerKey = this.state.arenaReducerDict._curSwitch.reducerKey;
    if (
      reducerKey != null &&
      reducerKey !== this.state.arenaReducerDict._curSwitch.reducerKey
    ) {
      refreshFlag === true;
      this.context.store.dispatch({
        type: ARENA_SWITCH_CLEAR_REDUX,
        sagaTaskPromise: this.state.sagaTaskPromise
      });
      newReducerKey = switchRmAndAddReducer(
        this.context.store,
        this.state.arenaReducerDict._curSwitch.reducerKey,
        reducerKey,
        createArenaSwitchReducer
      );
      this.state.sagaTaskPromise = new Promise(resolve =>
        this.context.store.dispatch({
          type: ARENA_SWITCH_INIT_SAGA,
          reducerKey,
          setSagaTask: resolve
        })
      );
    }
    if (
      nextContext.arenaReducerDict !== this.context.arenaReducerDict ||
      reducerKey !== this.props.reducerKey ||
      vReducerKey !== this.props.vReducerKey ||
      refreshFlag === true
    ) {
      this.state.arenaReducerDict = calcSwitchReducerDict(
        nextContext.arenaReducerDict,
        newReducerKey,
        nextProps.vReducerKey
      );
    }
  }

  componentWillUnmount() {
    this.context.store.dispatch({
      type: ARENA_SWITCH_CLEAR_REDUX,
      reducerKey: this.state.arenaReducerDict._curSwitch.reducerKey,
      sagaTaskPromise: this.state.sagaTaskPromise
    });
  }

  getChildContext() {
    return {
      arenaReducerDict: this.state.arenaReducerDict,
      arenaSwitchDictItem: this.state.arenaReducerDict._curSwitch
    };
  }

  render() {
    return (
      <Switch location={this.props.location}>{this.props.children}</Switch>
    );
  }
}

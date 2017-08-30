import React, { Component } from "react";
import PropTypes from "prop-types";
import { Router, Switch } from "react-router-dom";
import createHistory from "history/createBrowserHistory";
import {
  ARENASWITCH_INIT_SAGA,
  ARENASWITCH_KILL_SAGA
} from "../redux/actionTypes";
import createArenaSwitchReducer from "../redux/reducers/createArenaSwitchReducer";
import { switchAddReducer, switchRmAndAddReducer } from "../utils";

export default class ArenaSwitch extends Component {
  static contextTypes = {
    store: PropTypes.any,
    arenaReducerDict: PropTypes.object
  };

  static childContextTypes = {
    arenaReducerDict: PropTypes.object
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
    let arenaReducerDict = this.calcNewReducerKeyDict(
      this.context.arenaReducerDict,
      reducerKey
    );
    this.state = {
      arenaReducerDict,
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
    let refreshFlag = false;
    if (
      reducerKey != null &&
      reducerKey !== this.state.arenaReducerDict._curSwitch.reducerKey
    ) {
      refreshFlag === true;
      this.context.store.dispatch({
        type: ARENASWITCH_KILL_SAGA,
        sagaTaskPromise: this.state.sagaTaskPromise
      });
      reducerKey = switchRmAndAddReducer(
        this.context.store,
        this.state.arenaReducerDict._curSwitch.reducerKey,
        reducerKey,
        createArenaSwitchReducer
      );
      this.state = {
        arenaReducerDict: this.calcNewReducerKeyDict(
          nextContext.arenaReducerDict,
          reducerKey
        ),
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
    this.context.store.removeReducer(
      this.state.arenaReducerDict._curSwitch.reducerKey
    );
  }

  calcNewReducerKeyDict(arenaReducerDict, switchReducerKey) {
    let newDict = Object.assign({}, arenaReducerDict);
    let item = { actions: {}, reducerKey: switchReducerKey };
    if (this.props.reducerKey) {
      newDict[this.props.reducerKey] = item;
    }
    if (this.props.vReducerKey) {
      newDict[this.props.vReducerKey] = item;
    }
    newDict._curSwitch = item;
    newDict._curScene = null;
    return newDict;
  }

  getChildContext() {
    return { arenaReducerDict: this.state.arenaReducerDict };
  }

  render() {
    return (
      <Switch location={this.props.location}>{this.props.children}</Switch>
    );
  }
}

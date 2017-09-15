import React, { Component } from "react";
import PropTypes from "prop-types";
import { Router, Switch } from "react-router-dom";
import createHistory from "history/createBrowserHistory";
import {
  ARENA_CURTAIN_INIT_SAGA,
  ARENA_CURTAIN_CLEAR_REDUX
} from "../../core/actionTypes";
import { createSwitchReducer } from "../../core/reducers";
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
      createSwitchReducer
    );
    let arenaReducerDict = calcSwitchReducerDict(
      this.context.arenaReducerDict,
      reducerKey,
      this.props.vReducerKey
    );
    this.state = {
      arenaReducerDict
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
    let curReducerKey = this.state.arenaReducerDict._curSwitch.reducerKey;
    if (
      nextContext.arenaReducerDict !== this.context.arenaReducerDict ||
      reducerKey !== this.props.reducerKey ||
      vReducerKey !== this.props.vReducerKey
    ) {
      let newReducerKey = curReducerKey;
      if (reducerKey !== curReducerKey && reducerKey != null) {
        newReducerKey = switchRmAndAddReducer(
          nextContext.store,
          curReducerKey,
          reducerKey,
          createSwitchReducer
        );
      }
      this.state.arenaReducerDict = calcSwitchReducerDict(
        nextContext.arenaReducerDict,
        newReducerKey,
        vReducerKey
      );
    }
  }

  getChildContext() {
    return {
      arenaReducerDict: this.state.arenaReducerDict
    };
  }

  render() {
    return (
      <Switch location={this.props.location}>{this.props.children}</Switch>
    );
  }
}

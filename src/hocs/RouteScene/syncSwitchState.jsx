import React, { Component } from "react";
import PropTypes from "prop-types";
import SoloScene from "../SoloScene";
import { ARENA_SWITCH_SET_STATE } from "../../core/actionTypes";
import { ARENA_ROUTESCENE_LOAD_START } from "../../actionTypes";

class ArenaSwitchSyncAgent extends Component {
  static contextTypes = {
    arenaReducerDict: PropTypes.object,
    store: PropTypes.any
  };
  componentWillMount() {
    let { store, notifyData } = this.props;
    let { arenaReducerDict } = this.context;
    store.dispatch({
      type: ARENA_SWITCH_SET_STATE,
      _reducerKey: arenaReducerDict._curSwitch.reducerKey,
      state: { location: notifyData.location, match: notifyData.match }
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let { store, notifyData } = nextProps;
    let { arenaReducerDict } = nextContext;
    store.dispatch({
      type: ARENA_SWITCH_SET_STATE,
      _reducerKey: arenaReducerDict._curSwitch.reducerKey,
      state: { location: notifyData.location, match: notifyData.match }
    });
  }

  render() {
    let {
      store,
      wrappedComponent,
      switchReducerKey,
      ...innerProps
    } = this.props;
    return React.createElement(wrappedComponent, innerProps);
  }
}

export default function(wrappedComponent) {
  let HOC = props => (
    <ArenaSwitchSyncAgent wrappedComponent={wrappedComponent} {...props} />
  );
  HOC.displayName = "ArenaSwitchSyncHOC";
  return HOC;
}

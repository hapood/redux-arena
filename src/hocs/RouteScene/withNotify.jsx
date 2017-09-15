import React, { Component } from "react";
import SoloScene from "../SoloScene";
import { ARENA_SWITCH_SET_STATE } from "../../core/actionTypes";

class NotifierProxy extends Component {
  componentWillMount() {
    let { store, notifyData, switchReducerKey, isNotifyOn } = this.props;
    if (isNotifyOn) {
      store.dispatch({
        type: ARENA_SWITCH_SET_STATE,
        _reducerKey: switchReducerKey,
        state: { location: notifyData.location, match: notifyData.match }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    let { store, notifyData, switchReducerKey, isNotifyOn } = nextProps;
    if (isNotifyOn) {
      store.dispatch({
        type: ARENA_SWITCH_SET_STATE,
        _reducerKey: switchReducerKey,
        state: { location: notifyData.location, match: notifyData.match }
      });
    }
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
    <NotifierProxy wrappedComponent={wrappedComponent} {...props} />
  );
  HOC.displayName = "RouteNotifier";
  return HOC;
}

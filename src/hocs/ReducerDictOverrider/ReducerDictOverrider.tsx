import * as React from "react";
import * as PropTypes from "prop-types";
import { ActionCreatorsMapObject } from "redux";
import { ReducerDictOverriderProps } from "./types";

export default class ReducerDictOverrider extends React.Component<
  ReducerDictOverriderProps
> {
  static childContextTypes = {
    arenaReducerDict: PropTypes.object
  };
  getChildContext() {
    return {
      arenaReducerDict: this.props.reducerDict
    };
  }
  render() {
    return this.props.children;
  }
}

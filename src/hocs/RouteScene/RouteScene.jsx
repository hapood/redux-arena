import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import invariant from "invariant";
import { ARENA_SWITCH_SET_STATE } from "../../core/actionTypes";
import { arenaSwitchConnect } from "../SceneBundle";

class RouteScene extends Component {
  static contextTypes = {
    arenaReducerDict: PropTypes.object,
    arenaSwitchDictItem: PropTypes.object,
    store: PropTypes.any
  };

  static propTypes = {
    asyncSceneBuldle: PropTypes.any,
    sceneBundle: PropTypes.any,
    SceneLoadingComponent: PropTypes.any,
    sceneProps: PropTypes.object,
    isNotifyOn: PropTypes.bool,
    notifyData: PropTypes.object,
    exact: PropTypes.bool,
    path: PropTypes.string,
    strict: PropTypes.bool
  };

  static defaultProps = {
    isNotifyOn: true,
    exact: true
  };

  componentWillMount() {
    let { arenaReducerDict, arenaSwitchDictItem, store } = this.context;
    invariant(
      arenaSwitchDictItem,
      "You should not use <RouteScene> outside a <ArenaSwitch>"
    );
    let newArenaReducerDict = Object.assign({}, arenaReducerDict, {
      _curSwitch: arenaSwitchDictItem
    });
    let {
      asyncSceneBundle,
      sceneBundle,
      SceneLoadingComponent,
      sceneProps,
      isNotifyOn,
      location,
      computedMatch
    } = this.props;
    store.dispatch({
      type: ARENA_SWITCH_SET_STATE,
      arenaSwitchReducerKey: newArenaReducerDict._curSwitch.reducerKey,
      state: { location, match: computedMatch }
    });
    let wrappedSceneBundle = arenaSwitchConnect(newArenaReducerDict);
    let sceneBundleElement = React.createElement(wrappedSceneBundle, {
      asyncSceneBundle,
      sceneBundle,
      SceneLoadingComponent,
      sceneProps,
      isNotifyOn
    });
    this.state = {
      wrappedSceneBundle,
      sceneBundleElement,
      arenaReducerDict: newArenaReducerDict
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let {
      location,
      computedMatch,
      asyncSceneBundle,
      sceneBundle,
      sceneProps,
      isNotifyOn,
      SceneLoadingComponent
    } = nextProps;
    let refreshFlag = false;
    if (
      this.context.arenaReducerDict !== nextContext.arenaReducerDict ||
      this.context.arenaSwitchDictItem !== nextContext.arenaSwitchDictItem
    ) {
      let newArenaReducerDict = Object.assign(
        {},
        nextContext.arenaReducerDict,
        {
          _curSwitch: nextContext.arenaSwitchDictItem
        }
      );
      this.state.arenaReducerDict = newArenaReducerDict;
      this.state.wrappedSceneBundle = arenaSwitchConnect(newArenaReducerDict);
      refreshFlag = true;
    }
    if (
      this.props.location !== location ||
      this.props.computedMatch !== computedMatch
    ) {
      nextContext.store.dispatch({
        type: ARENA_SWITCH_SET_STATE,
        arenaSwitchReducerKey: this.state.arenaReducerDict._curSwitch
          .reducerKey,
        state: { location, match: computedMatch }
      });
    }
    if (
      asyncSceneBundle !== this.props.asyncSceneBundle ||
      sceneBundle !== this.props.sceneBundle ||
      sceneProps !== this.props.sceneBundle ||
      SceneLoadingComponent !== this.props.SceneLoadingComponent ||
      isNotifyOn !== this.props.isNotifyOn ||
      refreshFlag === true
    ) {
      this.setState({
        sceneBundleElement: React.createElement(this.state.wrappedSceneBundle, {
          asyncSceneBundle,
          sceneBundle,
          sceneProps,
          isNotifyOn,
          SceneLoadingComponent
        })
      });
    }
  }

  render() {
    let {
      exact,
      strict,
      path,
      computedMatch,
      location,
      notifyData
    } = this.props;
    let { arenaReducerDict } = this.context;
    return (
      <Route
        location={location}
        computedMatch={computedMatch}
        exact={exact}
        path={path}
        strict={strict}
        render={props => {
          return React.cloneElement(this.state.sceneBundleElement, {
            key: path,
            notifyData: Object.assign({}, props, notifyData)
          });
        }}
      />
    );
  }
}

export default RouteScene;

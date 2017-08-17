import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import invariant from "invariant";
import SceneLoading from "../SceneLoading";
import { sceneSwitchConnect } from "../SceneBundle";

class PublicScene extends Component {
  static contextTypes = {
    sceneSwitchKey: PropTypes.string
  };

  static propTypes = {
    asyncSceneBuldle: PropTypes.any,
    scene: PropTypes.any,
    SceneLoadingComponent: PropTypes.any,
    exact: PropTypes.bool,
    path: PropTypes.string,
    strict: PropTypes.bool
  };

  static defaultProps = {
    SceneLoadingComponent: SceneLoading,
    exact: true
  };

  componentWillMount() {
    invariant(
      this.context.sceneSwitchKey,
      "You should not use <PublicScene> outside a <SceneSwitch>"
    );
    let {
      asyncSceneBundle,
      sceneBundle,
      SceneLoadingComponent,
      location,
      computedMatch
    } = this.props;
    this.state = {
      wrappedSceneBundle: sceneSwitchConnect(
        asyncSceneBundle,
        sceneBundle,
        SceneLoadingComponent,
        this.context.sceneSwitchKey,
        location,
        computedMatch
      )
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let {
      asyncSceneBundle,
      sceneBundle,
      SceneLoadingComponent,
      location,
      computedMatch
    } = nextProps;
    if (
      asyncSceneBundle !== this.props.asyncSceneBundle ||
      sceneBundle !== this.props.sceneBundle ||
      SceneLoadingComponent !== this.props.SceneLoadingComponent ||
      nextContext.sceneSwitchKey !== this.context.sceneSwitchKey
    ) {
      this.state.wrappedSceneBundle = sceneSwitchConnect(
        asyncSceneBundle,
        sceneBundle,
        SceneLoadingComponent,
        nextContext.sceneSwitchKey,
        location,
        computedMatch
      );
    }
  }

  render() {
    let { exact, strict, path } = this.props;
    return (
      <Route
        exact={exact}
        path={path}
        strict={strict}
        component={this.state.wrappedSceneBundle}
      />
    );
  }
}
export default PublicScene;

import React, { Component } from "react";
import PropTypes from "prop-types";
import PublicScene from "../PublicScene";
import SceneValidating from "../SceneValidating";
import SceneLoading from "../SceneLoading";
import { REFRESH_VALIDATE, FIRST_VALADATE } from "./validateType";

class PrivateScene extends Component {
  componentWillMount() {
    this.state = {
      isValid: false
    };
    this.props.onValidate(
      this.validateCb,
      this.props.match,
      this.props.location,
      FIRST_VALADATE
    );
  }

  validateCb = isValid => {
    if (isValid == true) {
      this.setState({ isValid: true });
      this.props.onPass();
    } else {
      this.setState({ isValid: false });
      this.props.onReject();
    }
  };

  componentWillReceiveProps(nextProps) {
    this.props.onValidate(
      this.validateCb,
      this.props.match,
      this.props.location,
      REFRESH_VALIDATE
    );
  }

  render() {
    let {
      asyncSceneBundle,
      sceneBundle,
      exact,
      strict,
      path,
      SceneValidatingComponent,
      SceneLoadingComponent
    } = this.props;
    if (this.state.isValid)
      return (
        <PublicScene
          {...{
            asyncSceneBundle,
            sceneBundle,
            exact,
            strict,
            path,
            SceneLoadingComponent
          }}
        />
      );
    return <SceneValidatingComponent />;
  }
}

PrivateScene.propTypes = {
  asyncSceneBundle: PropTypes.any,
  sceneBundle: PropTypes.any,
  SceneLoadingComponent: PropTypes.any,
  SceneValidatingComponent: PropTypes.any,
  exact: PropTypes.bool,
  strict: PropTypes.bool,
  path: PropTypes.string,
  onValidate: PropTypes.func.isRequired,
  onPass: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired
};

PrivateScene.defaultProps = {
  SceneValidatingComponent: SceneValidating,
  SceneLoadingComponent: SceneLoading,
  exact: true
};

export default PrivateScene;

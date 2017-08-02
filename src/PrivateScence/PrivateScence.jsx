import React, { Component } from "react";
import PropTypes from "prop-types";
import PublicScene from "../PublicScene";
import SceneValidating from "../SceneValidating";
import SceneLoading from "../SceneLoading";
import { REFRESH_VALIDATE, FIRST_VALADATE } from "./validateType";

class PrivateScene extends Component {
  componentWillMount() {
    this.state = {
      isValidated: false
    };
    this.props.onValidate(FIRST_VALADATE).then(isValidated => {
      if (isValidated == true) {
        this.setState({ isValidated: true });
        this.props.onPass();
      } else {
        this.props.onReject();
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    this.props.onValidate(REFRESH_VALIDATE).then(isValidated => {
      if (isValidated == true) {
        this.setState({ isValidated: true });
        this.props.onPass();
      } else {
        this.setState({ isValidated: false });
        this.props.onReject();
      }
    });
  }

  render() {
    let {
      asyncSceneComponent,
      SceneComponent,
      state,
      reducer,
      saga,
      exact,
      strict,
      path,
      SceneValidatingComponent,
      SceneLoadingComponent
    } = this.props;
    if (this.state.isValidated)
      return (
        <PublicScene
          {...{
            asyncSceneComponent,
            SceneComponent,
            state,
            reducer,
            saga,
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
  asyncSceneComponent: PropTypes.any,
  SceneComponent: PropTypes.any,
  state: PropTypes.object,
  reducer: PropTypes.object,
  saga: PropTypes.object,
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
  SceneLoadingComponent: SceneLoading
};

export default PrivateScene;

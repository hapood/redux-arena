import React, { Component } from "react";
import { bindActionCreators } from "redux";
import * as actions from "./actions";
import { connect } from "react-redux";

class PageB extends Component {
  render() {
    return (
      <div>
        <div>
          <span>name:</span>
          <span>
            {this.props.name}
          </span>
        </div>
        <div>
          <span>pageB:</span>
          <span>
            {this.props.pageB}
          </span>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    pageB: state.scene.pageB,
    name: state.scene.name
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PageB);

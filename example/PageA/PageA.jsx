import React, { Component } from "react";
import { bindActionCreators } from "redux";
import * as actions from "./actions";
import { connect } from "react-redux";
import {Link } from "react-router-dom";

class PageA extends Component {
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
          <span>pageA:</span>
          <span>
            {this.props.pageA}
          </span>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    pageA: state.scene.pageA,
    name: state.scene.name
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PageA);

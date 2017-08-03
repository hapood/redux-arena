import React, { Component } from "react";
import { bindActionCreators } from "redux";
import * as actions from "./actions";
import { connect } from "react-redux";

class PageB extends Component {
  render() {
    return (
      <table>
        <tbody>
          <tr>
            <th>state_key</th>
            <th>state_value</th>
          </tr>
          <tr>
            <td>name:</td>
            <td>
              {this.props.name}
            </td>
          </tr>
          <tr>
            <td>pageB:</td>
            <td>
              {this.props.pageB}
            </td>
          </tr>
          <tr>
            <td>dynamicState:</td>
            <td>
              {this.props.dynamicState}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

function mapStateToProps(state) {
  return {
    pageB: state.scene.pageB,
    name: state.scene.name,
    dynamicState: state.scene.dynamicState
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PageB);

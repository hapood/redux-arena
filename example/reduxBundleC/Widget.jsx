import React, { Component } from "react";

export default class Widget extends Component {
  render() {
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <th>state_key</th>
              <th>state_value</th>
            </tr>
            <tr>
              <td>names:</td>
              <td>
                {this.props.name}
              </td>
            </tr>
            <tr>
              <td>Widget:</td>
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
            <tr>
              <td>cnt:</td>
              <td>
                {this.props.cnt}
              </td>
            </tr>
          </tbody>
        </table>
        <button onClick={() => this.props.addCnt()}>Add Widget Cnt</button>
        <button onClick={() => this.props.switchDynamicState(false)}>
          Stop DynimicState
        </button>
        <button onClick={() => this.props.switchDynamicState(true)}>
          Start DynimicState
        </button>
      </div>
    );
  }
}

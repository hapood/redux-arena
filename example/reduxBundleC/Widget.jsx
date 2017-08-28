import React, { Component } from "react";

export default class Widget extends Component {
  render() {
    let { state, actions } = this.props;
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <th>state_key</th>
              <th>state_value</th>
            </tr>
            <tr>
              <td>name:</td>
              <td>
                {state.name}
              </td>
            </tr>
            <tr>
              <td>Widget:</td>
              <td>
                {state.pageB}
              </td>
            </tr>
            <tr>
              <td>dynamicState:</td>
              <td>
                {state.dynamicState}
              </td>
            </tr>
            <tr>
              <td>cnt:</td>
              <td>
                {state.cnt}
              </td>
            </tr>
          </tbody>
        </table>
        <button onClick={() => actions.addCnt()}>Add Widget Cnt</button>
        <button onClick={() => actions.switchDynamicState(false)}>
          Stop DynimicState
        </button>
        <button onClick={() => actions.switchDynamicState(true)}>
          Start DynimicState
        </button>
      </div>
    );
  }
}

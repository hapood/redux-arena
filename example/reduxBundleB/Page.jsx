import React, { Component } from "react";

export default class Page extends Component {
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
              <td>pageB:</td>
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
        <button onClick={() => actions.addCnt()}>Add Cnt</button>
      </div>
    );
  }
}

import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class PageA extends Component {
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
              <td>name:</td>
              <td>
                {this.props.name}
              </td>
            </tr>
            <tr>
              <td>pageA:</td>
              <td>
                {this.props.pageA}
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
        <button onClick={() => this.props.addCnt()}>Add Cnt</button>
      </div>
    );
  }
}
import React, { Component } from "react";
import { SoloScene } from "redux-arena";
import childBundle from "./child";

export default class Parent extends Component {
  render() {
    let { state } = this.props;
    return (
      <div style={{ padding: "1rem" }}>
        <table style={{ width: "20rem" }}>
          <tbody>
            <tr>
              <th>state_key</th>
              <th>state_value</th>
            </tr>
            <tr>
              <td>name:</td>
              <td>{state.name}</td>
            </tr>
            <tr>
              <td>cnt:</td>
              <td>{state.cnt}</td>
            </tr>
          </tbody>
        </table>
        <SoloScene sceneBundle={childBundle} />
      </div>
    );
  }
}

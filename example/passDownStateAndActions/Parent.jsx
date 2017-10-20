import React, { Component } from "react";
import { ArenaScene } from "redux-arena";
import childBundle from "./child";

export default class Parent extends Component {
  render() {
    let { name, cnt } = this.props;
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
              <td>{name}</td>
            </tr>
            <tr>
              <td>cnt:</td>
              <td>{cnt}</td>
            </tr>
          </tbody>
        </table>
        <ArenaScene sceneBundle={childBundle} />
      </div>
    );
  }
}

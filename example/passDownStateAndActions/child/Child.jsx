import React, { Component } from "react";

export default class Child extends Component {
  render() {
    let { state, parentState, actions, parentActions } = this.props;
    return (
      <div
        style={{
          marginTop: "1rem",
          border: "solid #000 1px",
          padding: "1rem",
          width: "20rem"
        }}
      >
        <table style={{ width: "100%" }}>
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
              <td>parentState:</td>
              <td>{JSON.stringify(parentState)}</td>
            </tr>
            <tr>
              <td>cnt:</td>
              <td>{state.cnt}</td>
            </tr>
          </tbody>
        </table>
        <div
          style={{
            marginTop: "1rem",
            border: "solid #000 1px",
            padding: "1rem"
          }}
        >
          <div style={{ marginTop: "1rem" }}>
            <button onClick={actions.addCnt}>Add Count</button>
            <button style={{ marginLeft: "1rem" }} onClick={actions.clearCnt}>
              Clear count
            </button>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <button onClick={parentActions.addCnt}>Parent's Add Count</button>
            <button
              style={{ marginLeft: "1rem" }}
              onClick={parentActions.clearCnt}
            >
              Parent's Clear count
            </button>
          </div>
        </div>
      </div>
    );
  }
}

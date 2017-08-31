import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class ScopedPage extends Component {
  render() {
    let { state, actions } = this.props;
    return (
      <div style={{ marginLeft: "1rem" }}>
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
              <td>dynamicState:</td>
              <td>{state.dynamicState}</td>
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
            padding: "1rem",
            width: "20rem"
          }}
        >
          <div style={{ lineHeight: "1.5rem" }}>
            <button onClick={actions.addCnt}>Add Page Count</button> and{" "}
            <span style={{ color: "orange" }}>[Add Total Count]</span> has same
            action type "ADD_CNT", but scoped reducer will ignore other moudle's
            "ADD_CNT".
          </div>
          <div
            style={{
              lineHeight: "1.5rem",
              marginTop: "1rem"
            }}
          >
            <button onClick={actions.clearCnt}>Clear Page Count</button>{" "}
            dispatch action type "ARENA_SCENE_SET_STATE" and set this page's cnt 0.
          </div>
        </div>
        <div
          style={{
            marginTop: "1rem",
            width: "20rem",
            lineHeight: "1.5rem",
            border: "solid #000 1px",
            padding: "1rem"
          }}
        >
          Saga can be scoped by wrapping with sceneActionSaga.
          <div style={{ marginTop: "1rem" }}>
            <button onClick={() => actions.switchDynamicState(true)}>
              Start DynimicState
            </button>
            <button
              style={{ marginLeft: "1rem" }}
              onClick={() => actions.switchDynamicState(false)}
            >
              Stop DynimicState
            </button>
          </div>
        </div>
      </div>
    );
  }
}

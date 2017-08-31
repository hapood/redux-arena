import React, { Component } from "react";
import { SoloScene } from "redux-arena";
import opPanelBundle from "./opPanel";

export default class Container extends Component {
  render() {
    let { state, actions } = this.props;
    return (
      <div style={{ width: "20rem", padding: "1rem" }}>
        <div>
          All panel is from same redux module, passing diffrent{" "}
          <span style={{ color: "orange" }}>"sceneProps"</span> for reuse.
        </div>
        <div
          style={{
            marginTop: "1rem"
          }}
        >
          <button onClick={actions.addPanel}>Add Panel</button>
          <button style={{ marginLeft: "1rem" }} onClick={actions.delPanel}>
            Del Panel
          </button>
        </div>
        <div
          style={{
            marginTop: "1rem"
          }}
        >
          {Array(state.panelNum)
            .fill()
            .map((_, i) => (
              <SoloScene
                key={i}
                sceneBundle={opPanelBundle}
                sceneProps={{ step: i }}
              />
            ))}
        </div>
      </div>
    );
  }
}

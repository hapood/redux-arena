import * as React from "react";
import OpPanel from "./OpPanel";
import { State, Actions } from "./types";

export default class Container extends React.Component<
  State & { actions: Actions }
> {
  render() {
    let { panelNum, actions } = this.props;
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
          {Array(panelNum)
            .fill(null)
            .map((_, i) => <OpPanel key={i} step={i} />)}
        </div>
      </div>
    );
  }
}

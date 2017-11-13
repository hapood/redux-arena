import * as React from "react";
import { Actions } from "./types";

export default class OpPanel extends React.Component<{
  actions: Actions;
  step: number;
}> {
  addCnt = () => this.props.actions.addCnt(this.props.step);

  render() {
    return (
      <div
        style={{
          width: "10rem",
          marginTop: "1rem",
          padding: "1rem",
          border: "solid #000 1px"
        }}
      >
        <div>Add-Total-Count Panel</div>
        <button style={{ marginTop: "1rem" }} onClick={this.addCnt}>
          Add {this.props.step}
        </button>
      </div>
    );
  }
}

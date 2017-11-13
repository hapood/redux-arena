import * as React from "react";
import Child from "./child";
import { State, Actions } from "./types";

export default class Parent extends React.Component<
  State & { actions: Actions }
> {
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
        <Child />
      </div>
    );
  }
}

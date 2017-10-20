import * as React from "react";
import { Props } from "./types";

export default class PageB extends React.Component<Props> {
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
              <td>{this.props.name}</td>
            </tr>
            <tr>
              <td>pageB:</td>
              <td>{this.props.pageB}</td>
            </tr>
            <tr>
              <td>cnt:</td>
              <td>{this.props.cnt}</td>
            </tr>
          </tbody>
        </table>
        <button onClick={() => this.props.actions.addCnt()}>Add Cnt</button>
      </div>
    );
  }
}

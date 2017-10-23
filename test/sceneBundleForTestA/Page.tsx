import * as React from "react";
import { Props } from "./types";

export default class PageA extends React.Component<Props> {
  componentWillMount() {
    this.props.actions.addCnt();
    this.props.actions.addSagaCnt();
    this.props.actions.addCntBySaga();
  }

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
              <td>pageA:</td>
              <td>{this.props.pageA}</td>
            </tr>
            <tr>
              <td>sagaCnt:</td>
              <td>{this.props.sagaCnt}</td>
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

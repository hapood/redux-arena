import React, { Component } from "react";

export default class PageA extends Component {
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
        <button onClick={() => this.props.addCnt()}>Add Cnt</button>
      </div>
    );
  }
}

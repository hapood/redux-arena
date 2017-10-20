import React, { Component } from "react"

export default class Child extends Component {
    render() {
        let { name, cnt, parentState, actions, parentActions } = this.props
        return (
            <div
                style={{
                    marginTop: "1rem",
                    border: "solid #000 1px",
                    padding: "1rem",
                    width: "20rem"
                }}
            >
                <span style={{ lineHeight: "1.5rem" }}>
                    Map parent's state to props parentState by vReducerKey{" "}
                    <span style={{ color: "orange" }}>"parent"</span>.
                </span>
                <table style={{ width: "100%", marginTop: "1rem" }}>
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
                            <td>parentState:</td>
                            <td>
                                <span>{JSON.stringify(parentState)}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>cnt:</td>
                            <td>{cnt}</td>
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
                    <span style={{ lineHeight: "1.5rem" }}>
                        Map parent's actions to props parentActions by vReducerKey{" "}
                        <span style={{ color: "orange" }}>"parent"</span>.
                    </span>
                    <div style={{ marginTop: "1rem" }}>
                        <button onClick={actions.addCnt}>Add Count</button>
                        <button style={{ marginLeft: "1rem" }} onClick={actions.clearCnt}>
                            Clear count
                        </button>
                    </div>
                    <div style={{ marginTop: "1rem" }}>
                        <button onClick={parentActions.addCnt}>Parent's Add Count</button>
                        <button style={{ marginLeft: "1rem" }} onClick={parentActions.clearCnt}>
                            Parent's Clear count
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

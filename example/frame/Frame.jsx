import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Router, Link } from "react-router-dom";
import PublicScene from "../../src/PublicScene";
import SceneSwitch from "../../src/SceneSwitch";
import pageABundle from "../pageABundle";
import * as actions from "./redux/actions";
import DevTools from './DevTools';

const asyncPageB = import("../pageBBundle");
class Frame extends Component {
  componentWillMount() {
    this.state = { a: 1 };
  }
  render() {
    return (
      <div>
        <Router history={this.props.history}>
          <div>
            <ul>
              <li>
                <Link to="/pageA">pageA</Link>
              </li>
              <li>
                <Link to="/asyncPageB">asyncPageB</Link>
              </li>
              <li>
                <Link to="/topics">Topics</Link>
              </li>
            </ul>
            <hr />
            <button onClick={() => this.setState({ a: this.state.a + 1 })}>
              re-render
            </button>
            <div style={{ marginTop: "1rem" }}>
              <SceneSwitch>
                <PublicScene path="/pageA" sceneBundle={pageABundle} />
                <PublicScene path="/asyncPageB" asyncSceneBundle={asyncPageB} />
              </SceneSwitch>
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Frame);

import React, { Component } from "react";
import styles from "./styles";
import injectSheet from "react-jss";

class LoadingPage extends Component {
  render() {
    let { classes } = this.props;

    return (
      <div className={classes.wrapper}>
        <div className={classes.loader}>
          <div className={classes.box} />
          <div className={classes.hill} />
        </div>
      </div>
    );
  }
}

export default injectSheet(styles)(LoadingPage);

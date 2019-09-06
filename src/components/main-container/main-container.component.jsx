import React from "react";
import SelectOptions from "../select-options/select-options.component";
import DisplayTree from "../display-tree/display-tree.component";

import "./main-container.styles.css";
class MainContainer extends React.Component {
  state = { N: 0, M: 0, faulty: [] };

  handleSubmit = (N, M, faulty) => {
    this.setState({ N, M, faulty });
  };
  render() {
    const { M, N, faulty } = this.state;
    return (
      <div className="main-container">
        <div className="container">
          <SelectOptions onSubmitClick={this.handleSubmit} />
          <DisplayTree N={N} M={M} faulty={faulty} />
        </div>
      </div>
    );
  }
}

export default MainContainer;

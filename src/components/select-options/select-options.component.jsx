import React from "react";
import "./select-options.styles.css";
class SelectOptions extends React.Component {
  constructor() {
    super();
    this.state = {
      N: 0,
      faulty: []
    };
  }

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: parseInt(value), faulty: [] });
  };

  handleClick = event => {
    const { checked, value } = event.target;
    const { faulty } = this.state;
    if (checked) this.setState({ faulty: [...faulty, parseInt(value)] });
    else
      this.setState({
        faulty: faulty.filter(e => e !== parseInt(value))
      });
  };

  renderCheckboxes() {
    let arr = [];
    for (let i = 0; i < this.state.N; i++) arr.push(i);

    return arr.map(n => (
      <div className="checkbox" key={n}>
        <input
          checked={this.state.faulty.includes(n)}
          type="checkbox"
          value={n}
          onChange={this.handleClick}
        />
        <label>General {n}</label>
      </div>
    ));
  }

  render() {
    const { N, faulty } = this.state;
    return (
      <div className="options-container">
        <h1 className="title">Visualizing Lamport's Algorithm</h1>
        <h5>Number of Generals (N)</h5>
        <input
          className="general-count"
          name="N"
          type="number"
          onChange={this.handleChange}
        />

        <h5>Pick Traitor Generals</h5>
        {N > 0 && this.renderCheckboxes()}

        {N > 0 && (
          <button
            className="button"
            onClick={() => this.props.onSubmitClick(N, faulty.length, faulty)}
          >
            Submit
          </button>
        )}
      </div>
    );
  }
}

export default SelectOptions;

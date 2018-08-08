import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  constructor() {
    super();

    this.state = {
      textField: "",
      items: []
    };

    this.handleTextFieldChange = this.handleTextFieldChange.bind(this)
    this.handleStart = this.handleStart.bind(this)
  }

  handleTextFieldChange(event) {
    this.setState({
      textField: event.target.value
    });
  }

  handleStart(event) {
    event.preventDefault()
    this.setState({
      items: this.state.textField.split()
    })
  }

  render() {
    return (
      <div className="App">
        <span>Paste your text here:</span>
        <textarea
          className="text-box"
          type="text"
          value={this.state.textField}
        />
        <button onClick={}>Start</button>
      </div>
    );
  }
}

export default App;

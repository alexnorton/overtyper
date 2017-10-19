import React, { Component } from 'react';

import matchInput from './matchInput';
import TranscriptDisplay from './TranscriptDisplay';

const transcript = require('./transcript.json');

class App extends Component {
  constructor() {
    super();

    this.state = {
      transcript,
      inputValue: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {

  }

  handleInputChange(e) {
    const inputValue = e.target.value;

    const matches = matchInput(inputValue, this.state.transcript);

    console.log(matches);

    this.setState({ inputValue, matches });
  }

  render() {
    return (
      <div className="container">
        <h1 className="title">Overtyper</h1>
        <TranscriptDisplay
          transcript={this.state.transcript}
          matches={this.state.matches}
        />
        <input
          value={this.state.inputValue}
          onChange={this.handleInputChange}
        />
      </div>
    );
  }
}

export default App;

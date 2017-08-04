import React, { Component } from 'react';
import { Transcript } from 'transcript-model';

import matchInput from './matchInput';
import TranscriptDisplay from './TranscriptDisplay';

const transcriptJson = require('./transcript.json');

class App extends Component {
  constructor() {
    super();

    const transcript = Transcript.fromJSON(transcriptJson);

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
    matchInput(inputValue, this.state.transcript);
    this.setState({ inputValue });
  }

  render() {
    return (
      <div className="container">
        <h1 className="title">Overtyper</h1>
        <TranscriptDisplay transcript={this.state.transcript} />
        <input
          value={this.state.inputValue}
          onChange={this.handleInputChange}
        />
      </div>
    );
  }
}

export default App;

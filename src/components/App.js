import React, { Component } from 'react';

import matchInput from '../helpers/matchInput';
import TranscriptDisplay from './TranscriptDisplay';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      transcript: props.transcript,
      audio: props.audio,
      inputValue: '',
      correctionWindow: 5,
      playing: false,
      currentTime: 0,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    this.player.addEventListener('playing', () => {
      this.setState({
        playing: true,
      });
    });

    this.player.addEventListener('pause', () => {
      this.setState({
        playing: false,
      });
    });

    this.player.addEventListener('timeupdate', (e) => {
      this.setState({
        currentTime: e.target.currentTime,
      });
    });
  }

  handleInputChange(e) {
    this.player.pause();

    const inputValue = e.target.value;

    const matches = matchInput(inputValue, this.state.transcript);

    this.setState({ inputValue, matches });
  }

  render() {
    return (
      <div className="container">
        <h1 className="title">Overtyper</h1>
        <audio
          src={this.state.audio}
          controls
          controlsList="nodownload"
          ref={(player) => { this.player = player; }}
        />
        <h2>Correction</h2>
        <TranscriptDisplay
          transcript={this.state.transcript}
          matches={this.state.matches}
          currentTime={this.state.currentTime}
          correctionWindow={this.state.correctionWindow}
        />
        <h2>Input</h2>
        <input
          value={this.state.inputValue}
          onChange={this.handleInputChange}
          className="textInput"
        />
      </div>
    );
  }
}

export default App;

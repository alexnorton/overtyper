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
      this.input.focus();
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
    const playedWords = this.state.transcript
      .filter(word => word.start <= this.state.currentTime);

    const uncorrectablePlayedWords = playedWords
      .filter(word => word.end < this.state.currentTime - this.state.correctionWindow);

    const correctablePlayedWords = playedWords
      .filter(word => word.end >= this.state.currentTime - this.state.correctionWindow);

    const unplayedWords = this.state.transcript
      .filter(word => word.start > this.state.currentTime);

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
          uncorrectablePlayedWords={uncorrectablePlayedWords}
          correctablePlayedWords={correctablePlayedWords}
          unplayedWords={unplayedWords}
        />
        <h2>Input</h2>
        <input
          value={this.state.inputValue}
          onChange={this.handleInputChange}
          className="textInput"
          ref={(input) => { this.input = input; }}
        />
      </div>
    );
  }
}

export default App;

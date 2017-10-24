import React, { Component } from 'react';

import TranscriptDisplay from './TranscriptDisplay';
import matchCorrection from '../helpers/matchCorrection';

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
      segments: {
        uncorrectablePlayedWords: [],
        correctablePlayedWords: [],
        unplayedWords: props.transcript,
      },
      match: null,
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
      const playedWords = this.state.transcript
        .filter(word => word.start <= this.state.currentTime);

      const uncorrectablePlayedWords = playedWords
        .filter(word => word.end < this.state.currentTime - this.state.correctionWindow);

      const correctablePlayedWords = playedWords
        .filter(word => word.end >= this.state.currentTime - this.state.correctionWindow);

      const unplayedWords = this.state.transcript
        .filter(word => word.start > this.state.currentTime);

      this.setState({
        currentTime: e.target.currentTime,
        segments: {
          uncorrectablePlayedWords,
          correctablePlayedWords,
          unplayedWords,
        },
      });
    });
  }

  handleInputChange(e) {
    this.player.pause();

    const inputValue = e.target.value;

    const match = matchCorrection(
      this.state.segments.correctablePlayedWords.map(w => w.text),
      inputValue
    );

    console.log(match);

    this.setState({ inputValue, match });
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
        <h2>Transcript</h2>
        <TranscriptDisplay
          uncorrectablePlayedWords={this.state.segments.uncorrectablePlayedWords}
          correctablePlayedWords={this.state.segments.correctablePlayedWords}
          unplayedWords={this.state.segments.unplayedWords}
          match={this.state.match}
        />
        <h2>Correction</h2>
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

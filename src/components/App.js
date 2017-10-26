import React, { Component } from 'react';

import TranscriptDisplay from './TranscriptDisplay';
import matchCorrection from '../helpers/matchCorrection';
import applyCorrection from '../helpers/applyCorrection';
import isMatchComplete from '../helpers/isMatchComplete';

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

    this.handleEnter = this.handleEnter.bind(this);
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

  handleEnter(event) {
    event.preventDefault();

    if (this.state.inputValue) {
      if (this.state.match && isMatchComplete(this.state.match)) {
        this.setState({
          transcript: applyCorrection(
            this.state.transcript,
            this.state.transcript
              .filter(word => word.end < this.state.currentTime - this.state.correctionWindow)
              .length,
            this.state.match
          ),
          match: null,
          inputValue: '',
        });

        this.player.play();
      }
    } else if (this.state.playing) {
      this.player.pause();
    } else {
      this.player.play();
    }
  }

  handleInputChange(e) {
    this.player.pause();

    const inputValue = e.target.value;

    const match = matchCorrection(
      this.state.transcript
        .filter(word =>
          word.start <= this.state.currentTime
          && word.end > this.state.currentTime - this.state.correctionWindow
        )
        .map(w => w.text),
      inputValue
    );

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
          transcript={this.state.transcript}
          currentTime={this.state.currentTime}
          correctionWindow={this.state.correctionWindow}
          match={this.state.match}
        />
        <h2>Correction</h2>
        <form
          onSubmit={this.handleEnter}
        >
          <input
            value={this.state.inputValue}
            onChange={this.handleInputChange}
            className="textInput"
            ref={(input) => { this.input = input; }}
          />
        </form>
      </div>
    );
  }
}

export default App;

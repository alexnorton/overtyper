import React from 'react';
import ReactDOM from 'react-dom';

import 'bulma/css/bulma.css';
import './index.css';

import App from './components/App';

const transcript = require('./media/transcript.json');
const audio = require('./media/audio.mp3');

ReactDOM.render(
  <App
    transcript={transcript}
    audio={audio}
  />,
  document.getElementById('root')
);

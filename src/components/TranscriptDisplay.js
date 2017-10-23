import React from 'react';
import PropTypes from 'prop-types';

import './TranscriptDisplay.css';

const SPAN_TYPES = {
  MATCH_START: 'match_start',
  MATCH_END: 'match_end',
  REPLACED: 'replaced',
  REPLACEMENT: 'replacement',
};

const CorrectionWindow = ({ correctablePlayedWords, match }) => {
  return (
    <span className="transcriptDisplay--played_correctable">
      {correctablePlayedWords.map(word => word.text).join(' ')}
    </span>
  );
};

const TranscriptDisplay = ({ uncorrectablePlayedWords, correctablePlayedWords, unplayedWords, match }) => (
  <p className="transcriptDisplay">
    <span className="transcriptDisplay--played">
      <span className="transcriptDisplay--played_uncorrectable">
        {uncorrectablePlayedWords.map(word => word.text).join(' ')}
      </span>
      {' '}
      <CorrectionWindow
        correctablePlayedWords={correctablePlayedWords}
        match={match}
      />
    </span>
    {' '}
    <span className="transcriptDisplay--unplayed">
      {unplayedWords.map(word => word.text).join(' ')}
    </span>
  </p>
);


export default TranscriptDisplay;

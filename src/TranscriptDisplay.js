import React from 'react';
import PropTypes from 'prop-types';
import { Transcript } from 'transcript-model';

const TranscriptDisplay = ({ transcript }) => (
  <div>
    {transcript.segments.map((segment, segmentIndex) => (
      <p key={segmentIndex}>
        {segment.words.map((word, wordIndex) => (
          <span key={wordIndex}>{word.text}</span>
        ))
          .reduce((prev, curr) => [prev, ' ', curr])}
      </p>
    ))}
  </div>
);

TranscriptDisplay.propTypes = {
  transcript: PropTypes.instanceOf(Transcript).isRequired,
};

export default TranscriptDisplay;

import React from 'react';

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

export default TranscriptDisplay;
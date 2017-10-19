import React from 'react';
import PropTypes from 'prop-types';

import './TranscriptDisplay.css';

const SPAN_TYPES = {
  MATCH_START: 'match_start',
  MATCH_END: 'match_end',
  REPLACED: 'replaced',
  REPLACEMENT: 'replacement',
};

const getTranscriptSpans = (transcript, matches) => {
  let span = {
    type: null,
    words: [],
  };

  const spans = [];

  for (let index = 0; index < transcript.length; index += 1) {
    let spanType;

    if (matches.filter(match =>
      index >= match.start.index
      && index < match.start.index + match.start.length,
    ).length) {
      spanType = SPAN_TYPES.MATCH_START;
    } else if (matches.filter(match =>
      match.replacement
      && index >= match.start.index + match.start.length
      && (
        (!match.end && index < match.start.index + match.start.length + 1)
        || (match.end && index < match.end.index)
      ),
    ).length) {
      spanType = SPAN_TYPES.REPLACED;
    } else if (matches.filter(match =>
      match.end
      && index >= match.end.index
      && index < match.end.index + match.end.length,
    ).length) {
      spanType = SPAN_TYPES.MATCH_END;
    } else {
      spanType = null;
    }

    if (spanType !== span.type) {
      if (span.words.length > 0) {
        spans.push(span);
      }

      if (span.type === SPAN_TYPES.REPLACED
        && (spanType === null || spanType === SPAN_TYPES.MATCH_END)) {
        const thisMatch = matches.filter(match =>
          index === match.start.index + match.start.length + 1,
        )[0];

        spans.push({
          type: SPAN_TYPES.REPLACEMENT,
          words: [
            { text: thisMatch.replacement },
          ],
        });
      }

      span = {
        type: spanType,
        words: [],
      };
    }

    const word = transcript[index];

    span.words.push({
      start: word.start,
      end: word.end,
      text: word.text,
    });
  }

  spans.push(span);

  return spans;
};

const TranscriptDisplay = ({ transcript, matches }) => {
  const spans = getTranscriptSpans(transcript, matches);

  return (
    <p className="transcriptDisplay">
      {spans.map((span, spanIndex) => (
        <span key={spanIndex} className={span.type && `span_${span.type}`}>
          {span.words.map(word => word.text).join(' ')}
        </span>
      )).reduce((prev, curr) => [prev, ' ', curr])}
    </p>
  );
};

TranscriptDisplay.propTypes = {
  transcript: PropTypes.arrayOf(
    PropTypes.shape(),
  ).isRequired,
  matches: PropTypes.arrayOf(
    PropTypes.shape(),
  ),
};

TranscriptDisplay.defaultProps = {
  matches: [],
};

export default TranscriptDisplay;

export {
  getTranscriptSpans,
};

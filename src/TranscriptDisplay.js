import React from 'react';
import PropTypes from 'prop-types';
import { Transcript } from 'transcript-model';

const SPAN_TYPES = {
  MATCH_START: 'match_start',
  MATCH_END: 'match_end',
  REPLACED: 'replaced',
  REPLACEMENT: 'replacement',
};

const getTranscriptSpans = (transcript, matches) => {
  const segments = transcript.segments.toArray().map((segment, segmentIndex) => {
    let span = {
      type: null,
      words: [],
    };

    const spans = [];

    for (let wordIndex = 0; wordIndex < segment.words.size; wordIndex += 1) {
      let spanType;

      if (matches.filter(match =>
        segmentIndex === match.start.segment
        && wordIndex >= match.start.word
        && wordIndex < match.start.word + match.start.length,
      ).length) {
        spanType = SPAN_TYPES.MATCH_START;
      } else if (matches.filter(match =>
        match.replacement
        && segmentIndex === match.start.segment
        && wordIndex >= match.start.word + match.start.length
        && (
          (!match.end && wordIndex < match.start.word + match.start.length + 1)
          || (match.end && wordIndex < match.end.word)
        ),
      ).length) {
        spanType = SPAN_TYPES.REPLACED;
      } else if (matches.filter(match =>
        match.end
        && segmentIndex === match.end.segment
        && wordIndex >= match.end.word
        && wordIndex < match.end.word + match.end.length,
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
            segmentIndex === match.start.segment
            && wordIndex === match.start.word + match.start.length + 1,
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

      const word = segment.words.get(wordIndex);

      span.words.push({
        start: word.start,
        end: word.end,
        text: word.text,
      });
    }

    spans.push(span);

    return { spans };
  });

  return { segments };
};

const TranscriptDisplay = ({ transcript, matches }) => (
  <div>
    {transcript.segments.map((segment, segmentIndex) => (
      <p key={segmentIndex}>
        {segment.words.map((word, wordIndex) => (
          word.text
        ))
          .reduce((prev, curr) => [prev, ' ', curr])}
      </p>
    ))}
  </div>
);

TranscriptDisplay.propTypes = {
  transcript: PropTypes.instanceOf(Transcript).isRequired,
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

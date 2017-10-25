const applyCorrection = (transcript, windowStart, correction) => {
  if (!correction) {
    return transcript;
  }

  const replacementWords = correction.replacement.split(' ');

  const replacedLength = correction.end.index - correction.start.index - correction.start.length;

  if (replacementWords.length === replacedLength) {
    const correctedTranscript = transcript.slice(0);

    replacementWords.forEach((replacementText, index) => {
      const word = correctedTranscript[
        windowStart + correction.start.index + correction.start.length + index
      ];

      correctedTranscript[
        windowStart + correction.start.index + correction.start.length + index
      ] = Object.assign({}, word, { text: replacementText });
    });

    return correctedTranscript;
  }

  return transcript.slice(0, windowStart + correction.start.index + correction.start.length)
    .concat([{
      text: correction.replacement,
      start: transcript[windowStart + correction.start.index + correction.start.length].start,
      end: transcript[(windowStart + correction.end.index) - 1].end,
    }])
    .concat(transcript.slice(windowStart + correction.end.index));
};

export default applyCorrection;

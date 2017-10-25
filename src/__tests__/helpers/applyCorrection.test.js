import applyCorrection from '../../helpers/applyCorrection';

describe('applyCorrection', () => {
  const transcript = [
    { text: 'He', start: 0.05, end: 0.64 },
    { text: 'was', start: 0.65, end: 0.96 },
    { text: 'the', start: 0.96, end: 1.06 },
    { text: 'head', start: 1.06, end: 1.39 },
    { text: 'of', start: 1.39, end: 1.52 },
    { text: 'diagnostic', start: 1.53, end: 2.18 },
    { text: 'medicine', start: 2.18, end: 2.57 },
    { text: 'is', start: 3.7, end: 4 },
    { text: 'remarkable', start: 4.01, end: 4.82 },
    { text: 'notion', start: 4.85, end: 5.33 },
    { text: 'remarkable', start: 5.37, end: 5.91 },
    { text: 'character', start: 5.91, end: 6.47 },
    { text: 'more', start: 7.11, end: 7.36 },
    { text: 'remarkable', start: 7.36, end: 7.80 },
    { text: 'then', start: 7.8, end: 8.22 },
    { text: 'than', start: 8.22, end: 8.41 },
    { text: 'now.', start: 8.42, end: 8.82 },
    { text: 'I', start: 8.82, end: 8.95 },
    { text: 'think', start: 8.95, end: 9.33 },
    { text: 'in', start: 9.36, end: 9.75 },
    { text: 'that', start: 9.78, end: 10.28 },
    { text: 'up', start: 10.79, end: 11.01 },
    { text: 'until', start: 11.01, end: 11.39 },
    { text: 'that', start: 11.39, end: 11.60 },
    { text: 'point', start: 11.6, end: 11.96 },
  ];

  it('passes through the transcript when there is no correction', () => {
    const match = null;
    const windowStart = 4;

    const correctedTranscript = applyCorrection(transcript, windowStart, match);

    expect(correctedTranscript).toEqual(transcript);
  });

  it('applies correction when the replacement has the same number of words', () => {
    const match = {
      start: { index: 2, length: 1 },
      replacement: 'this reshmarkable',
      end: { index: 5, length: 2 },
    };
    const windowStart = 4;

    const correctedTranscript = applyCorrection(transcript, windowStart, match);

    expect(correctedTranscript).toEqual([
      { text: 'He', start: 0.05, end: 0.64 },
      { text: 'was', start: 0.65, end: 0.96 },
      { text: 'the', start: 0.96, end: 1.06 },
      { text: 'head', start: 1.06, end: 1.39 },
      { text: 'of', start: 1.39, end: 1.52 },
      { text: 'diagnostic', start: 1.53, end: 2.18 },
      { text: 'medicine', start: 2.18, end: 2.57 },
      { text: 'this', start: 3.7, end: 4 },
      { text: 'reshmarkable', start: 4.01, end: 4.82 },
      { text: 'notion', start: 4.85, end: 5.33 },
      { text: 'remarkable', start: 5.37, end: 5.91 },
      { text: 'character', start: 5.91, end: 6.47 },
      { text: 'more', start: 7.11, end: 7.36 },
      { text: 'remarkable', start: 7.36, end: 7.80 },
      { text: 'then', start: 7.8, end: 8.22 },
      { text: 'than', start: 8.22, end: 8.41 },
      { text: 'now.', start: 8.42, end: 8.82 },
      { text: 'I', start: 8.82, end: 8.95 },
      { text: 'think', start: 8.95, end: 9.33 },
      { text: 'in', start: 9.36, end: 9.75 },
      { text: 'that', start: 9.78, end: 10.28 },
      { text: 'up', start: 10.79, end: 11.01 },
      { text: 'until', start: 11.01, end: 11.39 },
      { text: 'that', start: 11.39, end: 11.60 },
      { text: 'point', start: 11.6, end: 11.96 },
    ]);
  });

  it('applies correction when the replacement has a different number of words', () => {
    const match = {
      start: { index: 2, length: 1 },
      replacement: 'this is a',
      end: { index: 4, length: 2 },
    };
    const windowStart = 4;

    const correctedTranscript = applyCorrection(transcript, windowStart, match);

    expect(correctedTranscript).toEqual([
      { text: 'He', start: 0.05, end: 0.64 },
      { text: 'was', start: 0.65, end: 0.96 },
      { text: 'the', start: 0.96, end: 1.06 },
      { text: 'head', start: 1.06, end: 1.39 },
      { text: 'of', start: 1.39, end: 1.52 },
      { text: 'diagnostic', start: 1.53, end: 2.18 },
      { text: 'medicine', start: 2.18, end: 2.57 },
      { text: 'this is a', start: 3.7, end: 4 },
      { text: 'remarkable', start: 4.01, end: 4.82 },
      { text: 'notion', start: 4.85, end: 5.33 },
      { text: 'remarkable', start: 5.37, end: 5.91 },
      { text: 'character', start: 5.91, end: 6.47 },
      { text: 'more', start: 7.11, end: 7.36 },
      { text: 'remarkable', start: 7.36, end: 7.80 },
      { text: 'then', start: 7.8, end: 8.22 },
      { text: 'than', start: 8.22, end: 8.41 },
      { text: 'now.', start: 8.42, end: 8.82 },
      { text: 'I', start: 8.82, end: 8.95 },
      { text: 'think', start: 8.95, end: 9.33 },
      { text: 'in', start: 9.36, end: 9.75 },
      { text: 'that', start: 9.78, end: 10.28 },
      { text: 'up', start: 10.79, end: 11.01 },
      { text: 'until', start: 11.01, end: 11.39 },
      { text: 'that', start: 11.39, end: 11.60 },
      { text: 'point', start: 11.6, end: 11.96 },
    ]);
  });
});

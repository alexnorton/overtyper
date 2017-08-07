import { Transcript } from 'transcript-model';

import matchInput, { getTokens, getMatches, getScore, getScores } from '../matchInput';

const transcript = Transcript.fromJSON({
  speakers: [
    { name: null },
    { name: null },
  ],
  segments: [
    { speaker: 1,
      words: [
        { start: 0.85, end: 1.15, text: 'Scottish' },
        { start: 1.18, end: 1.52, text: 'Government' },
        { start: 1.52, end: 2.16, text: 'remains' },
        { start: 2.30, end: 3.07, text: 'committed' },
        { start: 3.36, end: 4.06, text: 'strongly' },
      ] },
    { speaker: 1,
      words: [
        { start: 23.26, end: 23.44, text: 'I' },
        { start: 23.45, end: 23.70, text: 'am' },
        { start: 23.73, end: 24.11, text: 'therefore' },
        { start: 24.15, end: 24.76, text: 'confirming' },
        { start: 24.76, end: 25.20, text: 'today.' },
        { start: 25.30, end: 25.82, text: 'Having' },
      ] },
  ],
});

describe('getTokens', () => {
  it('converts sentences to tokens correctly', () => {
    const input = 'Scottish Government remains committed strongly to the principle of giving Scotland, a choice at the end of this process.';

    const output = getTokens(input);

    expect(output).toEqual(['scottish', 'government', 'remains', 'committed', 'strongly', 'to', 'the', 'principle', 'of', 'giving', 'scotland', 'a', 'choice', 'at', 'the', 'end', 'of', 'this', 'process']);
  });
});

describe('getScores', () => {
  it('calculates scores correctly', () => {
    const input = 'scottish';

    expect(getScores(input, transcript)).toEqual([
      { segment: 0, word: 0, score: 1 },
      { segment: 0, word: 1, score: 0 },
      { segment: 0, word: 2, score: 0 },
      { segment: 0, word: 3, score: 0.2222222222222222 },
      { segment: 0, word: 4, score: 0.125 },
      { segment: 1, word: 0, score: -6 },
      { segment: 1, word: 1, score: -3 },
      { segment: 1, word: 2, score: 0 },
      { segment: 1, word: 3, score: 0.2 },
      { segment: 1, word: 4, score: -0.16666666666666666 },
      { segment: 1, word: 5, score: -0.16666666666666666 },
    ]);
  });
});

describe('getMatches', () => {
  it('returns longest matches', () => {
    const scores = [
      [
        { segment: 0, word: 0, score: 0.1 },
        { segment: 0, word: 1, score: 0 },
        { segment: 0, word: 2, score: 0.05 },
        { segment: 0, word: 3, score: 0.6 },
        { segment: 0, word: 4, score: 0.92 },
        { segment: 0, word: 5, score: 0 },
        { segment: 0, word: 6, score: 0.17 },
        { segment: 0, word: 7, score: 0.2 },
        { segment: 1, word: 0, score: 0.95 },
        { segment: 1, word: 1, score: 0.1 },
        { segment: 1, word: 2, score: 0.4 },
        { segment: 1, word: 3, score: 0.34 },
        { segment: 1, word: 4, score: 0.03 },
      ],
      [
        { segment: 0, word: 0, score: 0 },
        { segment: 0, word: 1, score: 0.3 },
        { segment: 0, word: 2, score: 0.4 },
        { segment: 0, word: 3, score: 0.08 },
        { segment: 0, word: 4, score: 0.52 },
        { segment: 0, word: 5, score: 1 },
        { segment: 0, word: 6, score: 0.02 },
        { segment: 0, word: 7, score: 0.7 },
        { segment: 1, word: 0, score: 0.02 },
        { segment: 1, word: 1, score: 0.55 },
        { segment: 1, word: 2, score: 0.21 },
        { segment: 1, word: 3, score: 0.05 },
        { segment: 1, word: 4, score: 0.3 },
      ],
    ];

    const threshold = 0.9;

    const matches = getMatches(scores, threshold);

    expect(matches).toEqual([
      { startSegment: 0, startWord: 4, length: 2 },
      { startSegment: 1, startWord: 0, length: 1 },
    ]);
  });
});

describe('getScore', () => {
  it('returns scores correctly', () => {
    const scores = [
      { segment: 0, word: 0, score: 0 },
      { segment: 0, word: 1, score: 0.3 },
      { segment: 0, word: 2, score: 0.4 },
      { segment: 0, word: 3, score: 0.08 },
      { segment: 0, word: 4, score: 0.52 },
      { segment: 1, word: 0, score: 0.02 },
      { segment: 1, word: 1, score: 0.55 },
      { segment: 1, word: 2, score: 0.21 },
      { segment: 1, word: 3, score: 0.05 },
    ];

    expect(getScore(scores, 0, 3)).toBe(0.08);
  });

  describe('matchInput', () => {
    it('return matches correctly', () => {
      const input = 'government remains';

      expect(matchInput(input, transcript)).toEqual([
        { startSegment: 0, startWord: 1, length: 2 },
      ]);
    });
  });
});

import { Transcript } from 'transcript-model';
import fs from 'fs';
import path from 'path';

import matchInput, { getTokens, getMatches, getScore, getScores } from '../matchInput';

const transcript = Transcript.fromJSON(
  JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'transcript.json'))),
);

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

    const scores = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'scores.json')));

    expect(getScores(input, transcript)).toEqual(scores);
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

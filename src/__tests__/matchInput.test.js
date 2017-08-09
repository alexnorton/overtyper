import { Transcript } from 'transcript-model';
import fs from 'fs';
import path from 'path';

import matchInput, {
  getTokens,
  getForwardsMatches,
  getBackwardsMatches,
  getScore,
  getScores,
} from '../matchInput';

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

describe('getForwardsMatches', () => {
  it('returns longest matches', () => {
    const input = 'the end of the pizzas that process';

    const tokens = getTokens(input);
    const scores = tokens.map(token => getScores(token, transcript));

    const threshold = 0.9;

    const matches = getForwardsMatches(scores, threshold);

    expect(matches).toEqual([
      { length: 1, segment: 0, word: 6 },
      { length: 3, segment: 0, word: 14 },
      { length: 1, segment: 1, word: 18 },
      { length: 4, segment: 1, word: 28 },
      { length: 1, segment: 1, word: 31 },
      { length: 1, segment: 2, word: 9 },
      { length: 1, segment: 2, word: 14 },
      { length: 1, segment: 3, word: 6 },
    ]);
  });
});

describe('getBackwardsMatches', () => {
  it('returns longest matches', () => {
    const input = 'the end of the pizzas that process';

    const tokens = getTokens(input);
    const scores = tokens.map(token => getScores(token, transcript));

    const threshold = 0.9;

    const matches = getBackwardsMatches(scores, threshold);

    expect(matches).toEqual([
      { segment: 0, word: 18, length: 1 },
      { segment: 1, word: 33, length: 2 },
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
});

describe('matchInput', () => {
  it('returns an empty array when there are no matches', () => {
    const input = 'alex is great';

    expect(matchInput(input, transcript)).toEqual([]);
  });

  it('return a single match correctly', () => {
    const input = 'listened and something the scottish';

    expect(matchInput(input, transcript)).toEqual([{
      start: { segment: 2, word: 6, length: 2 },
      end: { segment: 2, word: 9, length: 2 },
      replacement: 'something',
    }]);
  });

  it('returns multiple potential matches correctly', () => {
    const input = 'scottish government';

    expect(matchInput(input, transcript)).toEqual([
      {
        start: { segment: 0, word: 0, length: 2 },
        end: null,
        replacement: null,
      },
      {
        start: { segment: 2, word: 10, length: 2 },
        end: null,
        replacement: null,
      },
    ]);
  });

  it('returns multiple potential matches with replacements correctly', () => {
    const input = 'scottish government something';

    expect(matchInput(input, transcript)).toEqual([
      {
        start: { segment: 0, word: 0, length: 2 },
        end: null,
        replacement: 'something',
      },
      {
        start: { segment: 2, word: 10, length: 2 },
        end: null,
        replacement: 'something',
      },
    ]);
  });
});

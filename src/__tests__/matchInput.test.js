import fs from 'fs';
import path from 'path';

import matchInput, {
  getTokens,
  getForwardsMatches,
  getBackwardsMatches,
  getScores,
} from '../matchInput';

const transcript = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'transcript.json')));

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
      { index: 6, length: 1 },
      { index: 14, length: 3 },
      { index: 40, length: 1 },
      { index: 50, length: 4 },
      { index: 53, length: 1 },
      { index: 70, length: 1 },
      { index: 75, length: 1 },
      { index: 89, length: 1 },
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
      { index: 18, length: 1 },
      { index: 55, length: 2 },
    ]);
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
      start: { index: 67, length: 2 },
      end: { index: 70, length: 2 },
      replacement: 'something',
    }]);
  });

  it('returns multiple potential matches correctly', () => {
    const input = 'scottish government';

    expect(matchInput(input, transcript)).toEqual([
      {
        start: { index: 0, length: 2 },
        end: null,
        replacement: null,
      },
      {
        start: { index: 71, length: 2 },
        end: null,
        replacement: null,
      },
    ]);
  });

  it('returns multiple potential matches with replacements correctly', () => {
    const input = 'scottish government something';

    expect(matchInput(input, transcript)).toEqual([
      {
        start: { index: 0, length: 2 },
        end: null,
        replacement: 'something',
      },
      {
        start: { index: 71, length: 2 },
        end: null,
        replacement: 'something',
      },
    ]);
  });
});

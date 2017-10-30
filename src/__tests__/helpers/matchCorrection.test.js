import matchCorrection, {
  getTokens,
  getForwardsMatches,
  getBackwardsMatches,
} from '../../helpers/matchCorrection';

const transcript = [
  'hair.', 'Lots', 'of', 'it', 'splendid', 'teeth', 'and', 'find', 'your', 'lines', 'and', 'had', 'to', 'find',
];

describe('getTokens', () => {
  it('converts input to tokens correctly', () => {
    const input = 'Scottish Government remains committed strongly to the principle of giving Scotland, a choice at the end of this process.';

    const output = getTokens(input);

    expect(output).toEqual(['Scottish', 'Government', 'remains', 'committed', 'strongly', 'to', 'the', 'principle', 'of', 'giving', 'Scotland,', 'a', 'choice', 'at', 'the', 'end', 'of', 'this', 'process.']);
  });
});

describe('matchCorrection', () => {
  it('returns no matches', () => {
    const correction = 'blah hello strawberries';

    const match = matchCorrection(transcript, correction);

    expect(match).toEqual(null);
  });

  it('returns complete matches', () => {
    const correction = 'and fine jaw lines';

    const match = matchCorrection(transcript, correction);

    expect(match).toEqual({
      start: { index: 6, length: 1 },
      replacement: 'fine jaw',
      end: { index: 9, length: 1 },
    });
  });

  it('returns partial matches', () => {
    const correction = 'and fine jaw';

    const match = matchCorrection(transcript, correction);

    expect(match).toEqual({
      start: { index: 6, length: 1 },
      replacement: 'fine jaw',
      end: null,
    });
  });
});

describe('getForwardsMatches', () => {
  it('returns no matches', () => {
    const tokens = ['strawberries', 'hello'];

    const forwardsMatches = getForwardsMatches(transcript, tokens);

    expect(forwardsMatches).toEqual([]);
  });

  it('returns multiple matches', () => {
    const tokens = ['and', 'fine', 'jaw'];

    const forwardsMatches = getForwardsMatches(transcript, tokens);

    expect(forwardsMatches).toEqual([
      { index: 6, length: 1 },
      { index: 10, length: 1 },
    ]);
  });

  it('it returns different length matches', () => {
    const tokens = ['and', 'find'];

    const forwardsMatches = getForwardsMatches(transcript, tokens);

    expect(forwardsMatches).toEqual([
      { index: 6, length: 2 },
      { index: 10, length: 1 },
    ]);
  });
});

describe('getBackwardsMatches', () => {
  it('returns no matches', () => {
    const tokens = ['and', 'fine', 'jaw'];

    const backwardsMatches = getBackwardsMatches(transcript, tokens);

    expect(backwardsMatches).toEqual([]);
  });

  it('returns multiple matches', () => {
    const tokens = ['something', 'whatever', 'and'];

    const backwardsMatches = getBackwardsMatches(transcript, tokens);

    expect(backwardsMatches).toEqual([
      { index: 6, length: 1 },
      { index: 10, length: 1 },
    ]);
  });

  it('returns different length matches', () => {
    const tokens = ['it', 'something', 'teeth', 'and'];

    const backwardsMatches = getBackwardsMatches(transcript, tokens);

    expect(backwardsMatches).toEqual([
      { index: 5, length: 2 },
      { index: 10, length: 1 },
    ]);
  });
});

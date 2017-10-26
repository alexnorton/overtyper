import isMatchComplete from '../../helpers/isMatchComplete';

describe('isMatchComplete', () => {
  it('returns false for null matches', () => {
    const match = null;

    expect(isMatchComplete(match)).toBe(false);
  });

  it('returns false for an incomplete match with no replacement', () => {
    const match = {
      start: { index: 3, length: 2 },
      replacement: null,
      end: null,
    };

    expect(isMatchComplete(match)).toBe(false);
  });

  it('returns false for an incomplete match with replacement', () => {
    const match = {
      start: { index: 3, length: 2 },
      replacement: 'hi there',
      end: null,
    };

    expect(isMatchComplete(match)).toBe(false);
  });

  it('returns true for an complete match', () => {
    const match = {
      start: { index: 3, length: 2 },
      replacement: 'hi there',
      end: { index: 6, length: 1 },
    };

    expect(isMatchComplete(match)).toBe(true);
  });
});

import levenshtein from 'fast-levenshtein';

const SCORE_THRESHOLD = 0.9;

const normaliseToken = input => (
  input.toLowerCase().replace(/[^A-Za-z ]/g, '')
);

const getTokens = input => (
  input
    .trim()
    .split(' ')
    .map(normaliseToken)
);

const getScores = (input, transcript) => {
  const results = [];

  transcript.segments.forEach((segment, segmentIndex) => {
    segment.words.forEach((word, wordIndex) => {
      results.push({
        segment: segmentIndex,
        word: wordIndex,
        score: (word.text.length - levenshtein.get(normaliseToken(word.text), input))
          / word.text.length,
      });
    });
  });

  return results;
};

const getScore = (scores, segment, word) => {
  const results = scores.filter(score => score.segment === segment && score.word === word);
  return results.length > 0 && results[0].score;
};

const getMatches = (scores, scoreThreshold) => {
  const matchRoots = scores[0]
    .filter(score => score.score >= scoreThreshold)
    .map(score => ({
      startSegment: score.segment,
      startWord: score.word,
      length: 1,
    }));

  return matchRoots.map((initialMatch) => {
    let finished = false;

    const match = initialMatch;

    for (let i = 1; i < scores.length && !finished; i += 1) {
      if (getScore(scores, match.segment, match.word + i) > scoreThreshold) {
        match.length += 1;
      } else {
        finished = true;
      }
    }

    return match;
  });
};

const matchInput = (input, transcript) => {
  const tokens = getTokens(input);

  const scores = tokens.map(token => getScores(token, transcript));

  getMatches(scores, SCORE_THRESHOLD);
};

export default matchInput;

export {
  getTokens,
  getMatches,
  getScore,
};

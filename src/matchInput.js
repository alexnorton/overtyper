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

const getMatches = (scores, scoreThreshold) => {
  const matchRoots = scores[0]
    .filter(score => score.score >= scoreThreshold)
    .map(score => ({
      startSegment: score.segment,
      startWord: score.word,
      length: 1,
    }));

  console.log(matchRoots);

  matchRoots.map((initialMatch) => {
    const match = initialMatch;

    for(let i = 1; i < scores.length; i++) {
      
    }
  })
};

const matchInput = (input, transcript) => {
  const tokens = getTokens(input);

  const scores = tokens.map(token => getScores(token, transcript));

  getMatches(scores, SCORE_THRESHOLD);

  console.log(scores);


};

export default matchInput;

export {
  getTokens,
  getMatches,
};

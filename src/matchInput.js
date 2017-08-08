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

const getForwardsMatches = (scores, scoreThreshold) => {
  const matchRoots = scores[0]
    .filter(score => score.score >= scoreThreshold)
    .map(score => ({
      segment: score.segment,
      word: score.word,
      length: 1,
    }));

  return matchRoots.map((initialMatch) => {
    let finished = false;

    const match = initialMatch;

    for (let i = 1; !finished && i < scores.length; i += 1) {
      if (getScore(scores[i], match.segment, match.word + i) >= scoreThreshold) {
        match.length += 1;
      } else {
        finished = true;
      }
    }

    return match;
  });
};

const getBackwardsMatches = (scores, scoreThreshold) => {
  const matchRoots = scores[scores.length - 1]
    .filter(score => score.score >= scoreThreshold)
    .map(score => ({
      segment: score.segment,
      word: score.word,
      length: 1,
    }));

  return matchRoots.map((initialMatch) => {
    let finished = false;

    const match = initialMatch;

    for (let i = 1; !finished && i < scores.length; i += 1) {
      if (getScore(
        scores[scores.length - 1 - i], match.segment, match.word - i
      ) >= scoreThreshold) {
        match.length += 1;
      } else {
        finished = true;
      }
    }

    return {
      length: match.length,
      segment: match.segment,
      word: (match.word - match.length) + 1,
    };
  });
};

const matchInput = (input, transcript) => {
  const tokens = getTokens(input);
  const scores = tokens.map(token => getScores(token, transcript));

  const forwardsMatches = getForwardsMatches(scores, SCORE_THRESHOLD);

  if (forwardsMatches.length > 0) {
    const sortedForwardsMatches = forwardsMatches.sort((a, b) => a.length - b.length);

    return sortedForwardsMatches.map(match => ({
      start: match,
      end: null,
      replacement: tokens.length > match.length
        ? tokens.slice(match.length).join(' ') : null,
    }));
  }

  return [];
};

export default matchInput;

export {
  getTokens,
  getForwardsMatches,
  getBackwardsMatches,
  getScore,
  getScores,
};

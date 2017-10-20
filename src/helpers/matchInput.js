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

const getScores = (input, transcript) => (
  transcript.map(word => (
    word.text.length - levenshtein.get(normaliseToken(word.text), input))
        / word.text.length
  )
);

const getForwardsMatches = (scores, scoreThreshold) => {
  const matchRoots = scores[0]
    .map((score, index) => ({ score, index }))
    .filter(score => score.score >= scoreThreshold)
    .map(score => ({
      index: score.index,
      length: 1,
    }));

  return matchRoots.map((initialMatch) => {
    let finished = false;

    const match = initialMatch;

    for (let i = 1; !finished && i < scores.length; i += 1) {
      if (scores[i][match.index + i] >= scoreThreshold) {
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
    .map((score, index) => ({ score, index }))
    .filter(score => score.score >= scoreThreshold)
    .map(score => ({
      index: score.index,
      length: 1,
    }));

  return matchRoots.map((initialMatch) => {
    let finished = false;

    const match = initialMatch;

    for (let i = 1; !finished && i < scores.length; i += 1) {
      if (scores[scores.length - 1 - i][match.index - i] >= scoreThreshold) {
        match.length += 1;
      } else {
        finished = true;
      }
    }

    return {
      length: match.length,
      index: (match.index - match.length) + 1,
    };
  });
};

const matchInput = (input, transcript) => {
  const tokens = getTokens(input);
  const scores = tokens.map(token => getScores(token, transcript));

  const forwardsMatches = getForwardsMatches(scores, SCORE_THRESHOLD);

  if (forwardsMatches.length > 0) {
    const sortedForwardsMatches = forwardsMatches.sort(
      (a, b) => b.length - a.length,
    );

    const topForwardsMatches = sortedForwardsMatches.filter(
      match => match.length === sortedForwardsMatches[0].length
    );

    if (forwardsMatches.length < tokens.length) {
      const backwardsMatches = getBackwardsMatches(scores, SCORE_THRESHOLD);

      if (backwardsMatches.length > 0) {
        const sortedBackwardsMatches = backwardsMatches.sort(
          (a, b) => b.length - a.length,
        );

        const potentialMatches = topForwardsMatches.map(forwardsMatch =>
          backwardsMatches
            .filter(backwardsMatch => backwardsMatch.index > forwardsMatch.index)
            .map(backwardsMatch => ({
              start: forwardsMatch,
              end: backwardsMatch,
              replacement: tokens.slice(
                forwardsMatch.length,
                tokens.length - backwardsMatch.length,
              ).join(' '),
            }))
        ).reduce((a, b) => a.concat(b), []);

        return potentialMatches;

        // return [{
        //   start: sortedForwardsMatches[0],
        //   end: sortedBackwardsMatches[0],
        //   replacement: tokens.slice(
        //     sortedForwardsMatches[0].length,
        //     tokens.length - sortedBackwardsMatches[0].length,
        //   ).join(' '),
        // }];
      }
    }

    return topForwardsMatches.map(match => ({
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
  getScores,
};

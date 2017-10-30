const normaliseToken = input => input;

const getTokens = input => (
  input
    .trim()
    .split(' ')
    .map(normaliseToken)
);

const getForwardsMatches = (transcript, tokens) => {
  const matchRoots = transcript
    .map((word, index) => ({ word, index }))
    .filter(({ word }) => word === tokens[0])
    .map(({ index }) => ({ index, length: 1 }));

  return matchRoots.map((initialMatch) => {
    let finished = false;

    const match = initialMatch;

    for (let i = 1; !finished && i < tokens.length; i += 1) {
      if (transcript[match.index + i] === tokens[i]) {
        match.length += 1;
      } else {
        finished = true;
      }
    }

    return match;
  });
};

const getBackwardsMatches = (transcript, tokens) => {
  const matchRoots = transcript
    .map((word, index) => ({ word, index }))
    .filter(({ word }) => word === tokens[tokens.length - 1])
    .map(({ index }) => ({ index, length: 1 }));

  return matchRoots.map((initialMatch) => {
    let finished = false;

    const match = initialMatch;

    for (let i = 1; !finished && i < tokens.length; i += 1) {
      if (transcript[match.index - i] === tokens[tokens.length - i - 1]) {
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

const matchCorrection = (transcript, correction) => {
  const tokens = getTokens(correction);

  // Get forwards matches
  const forwardsMatches = getForwardsMatches(transcript, tokens);

  // If there are forwards matches
  if (forwardsMatches.length > 0) {
    let start;
    let end = null;
    let replacement = null;

    if (forwardsMatches.length === 1) {
      start = forwardsMatches[0];
    } else {
      // Sort by length
      const sortedForwardsMatches = forwardsMatches.sort(
        (a, b) => b.length - a.length,
      );

      // Get longest forward matches
      const longestForwardsMatches = sortedForwardsMatches.filter(
        match => match.length === sortedForwardsMatches[0].length
      );

      // If there is more than one
      if (longestForwardsMatches.length > 0) {
        // Choose the first one
        start = longestForwardsMatches
          .sort((a, b) => a.index - b.index)[0];
      } else {
        // Otherwise we have our longest match
        start = longestForwardsMatches[0];
      }
    }

    // Get backwards matches
    const backwardsMatches = getBackwardsMatches(transcript, tokens.slice(start.length));

    // If there are backwards matches
    if (backwardsMatches.length > 0) {
      if (backwardsMatches.length === 1) {
        end = backwardsMatches[0];
      } else {
        // Sort by length
        const sortedBackwardsMatches = backwardsMatches.sort(
          (a, b) => b.length - a.length,
        );

        // Get longest backwards matches
        const longestBackwardsMatches = sortedBackwardsMatches.filter(
          match => match.length === sortedBackwardsMatches[0].length
        );

        // If there is more than one
        if (longestBackwardsMatches.length > 0) {
          // Choose the first one
          end = longestBackwardsMatches
            .sort((a, b) => a.index - b.index)[0];
        } else {
          // Otherwise we have our longest match
          end = longestBackwardsMatches[0];
        }
      }
    }

    if (start.length < tokens.length) {
      replacement = tokens
        .slice(start.length, end ? tokens.length - end.length : tokens.length)
        .join(' ');
    }

    return {
      start,
      end,
      replacement,
    };
  }

  return null;
};

export default matchCorrection;

export {
  getTokens,
  getForwardsMatches,
  getBackwardsMatches,
};

const isMatchComplete = match => (
  (match
    && match.start
    && match.replacement
    && match.replacement.length > 0
    && match.end
    && true
  ) || false
);

export default isMatchComplete;

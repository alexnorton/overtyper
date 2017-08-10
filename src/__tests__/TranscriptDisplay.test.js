import fs from 'fs';
import path from 'path';
import { Transcript } from 'transcript-model';

import { getTranscriptSpans } from '../TranscriptDisplay';

const transcript = Transcript.fromJSON(
  JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'transcript.json'))),
);

describe('getTranscriptSpans', () => {
  it('returns correct spans when there are no matches', () => {
    const matches = [];

    const spans = getTranscriptSpans(transcript, matches);

    const expectedSpans = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'spans-no_matches.json')));

    expect(spans).toEqual(expectedSpans);
  });

  it('returns correct spans when there are potential matches', () => {
    const matches = [
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
    ];

    const spans = getTranscriptSpans(transcript, matches);

    const expectedSpans = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'spans-potential_matches.json')));

    expect(spans).toEqual(expectedSpans);
  });

  it('returns correct spans when there are potential matches with replacements', () => {
    const matches = [
      {
        start: { segment: 0, word: 0, length: 2 },
        end: null,
        replacement: 'hello',
      },
      {
        start: { segment: 2, word: 10, length: 2 },
        end: null,
        replacement: 'hello',
      },
    ];

    const spans = getTranscriptSpans(transcript, matches);

    const expectedSpans = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'spans-potential_matches.json')));

    expect(spans).toEqual(expectedSpans);
  });

  it('returns correct spans when there is a final match', () => {
    const matches = [{
      start: { segment: 2, word: 10, length: 2 },
      end: { segment: 2, word: 13, length: 1 },
      replacement: 'hello',
    }];

    const spans = getTranscriptSpans(transcript, matches);

    const expectedSpans = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'spans-final_match.json')));

    expect(spans).toEqual(expectedSpans);
  });
});

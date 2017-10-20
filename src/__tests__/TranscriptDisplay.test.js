import fs from 'fs';
import path from 'path';

import { getTranscriptSpans } from '../components/TranscriptDisplay';

const transcript = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'transcript.json')));

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
        start: { index: 0, length: 2 },
        end: null,
        replacement: null,
      },
      {
        start: { index: 71, length: 2 },
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
        start: { index: 0, length: 2 },
        end: null,
        replacement: 'hello',
      },
      {
        start: { index: 71, length: 2 },
        end: null,
        replacement: 'hello',
      },
    ];

    const spans = getTranscriptSpans(transcript, matches);

    const expectedSpans = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'spans-potential_matches_with_replacements.json')));

    expect(spans).toEqual(expectedSpans);
  });

  it('returns correct spans when there is a final match', () => {
    const matches = [{
      start: { index: 71, length: 2 },
      end: { index: 74, length: 1 },
      replacement: 'hello',
    }];

    const spans = getTranscriptSpans(transcript, matches);

    const expectedSpans = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'spans-final_match.json')));

    expect(spans).toEqual(expectedSpans);
  });
});

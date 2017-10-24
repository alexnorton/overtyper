import React from 'react';
import { shallow } from 'enzyme';

import { CorrectionWindow } from '../../components/TranscriptDisplay';

describe('CorrectionWindow', () => {
  // Hipster Ipsum 🙃
  const correctablePlayedWords = [
    { text: 'Vegan' },
    { text: 'tumeric' },
    { text: 'four' },
    { text: 'dollar' },
    { text: 'toast,' },
    { text: 'lo-fi' },
    { text: 'quinoa' },
    { text: 'palo' },
    { text: 'santo' },
    { text: 'fam' },
    { text: 'wolf' },
    { text: 'try-hard' },
    { text: 'whatever.' },
  ];

  it('Renders correctly when there is no match', () => {
    const match = null;

    expect(shallow(<CorrectionWindow
      correctablePlayedWords={correctablePlayedWords}
      match={match}
    />)).toHaveHTML(
      '<span class="transcriptDisplay--played_correctable">Vegan tumeric four dollar toast, lo-fi quinoa palo santo fam wolf try-hard whatever.</span>'
    );
  });

  it('Renders correctly when there is an incomplete match with no replacement', () => {
    const match = {
      start: { index: 2, length: 2 },
      replacement: null,
      end: null,
    };

    expect(shallow(<CorrectionWindow
      correctablePlayedWords={correctablePlayedWords}
      match={match}
    />)).toHaveHTML(
      '<span class="transcriptDisplay--played_correctable">Vegan tumeric <span class="match_start">four dollar</span> toast, lo-fi quinoa palo santo fam wolf try-hard whatever.</span>'
    );
  });

  it('Renders correctly when there is an incomplete match with a replacement', () => {
    const match = {
      start: { index: 2, length: 2 },
      replacement: 'edison bulb tofu',
      end: null,
    };

    expect(shallow(<CorrectionWindow
      correctablePlayedWords={correctablePlayedWords}
      match={match}
    />)).toHaveHTML(
      '<span class="transcriptDisplay--played_correctable">Vegan tumeric <span class="match_start">four dollar</span> <span class="replacement">edison bulb tofu</span> toast, lo-fi quinoa palo santo fam wolf try-hard whatever.</span>'
    );
  });

  it('Renders correctly when there is a complete match', () => {
    const match = {
      start: { index: 2, length: 2 },
      replacement: 'edison bulb tofu',
      end: { index: 6, length: 3 },
    };

    expect(shallow(<CorrectionWindow
      correctablePlayedWords={correctablePlayedWords}
      match={match}
    />)).toHaveHTML(
      '<span class="transcriptDisplay--played_correctable">Vegan tumeric <span class="match_start">four dollar</span> <span class="replaced">toast, lo-fi</span> <span class="replacement">edison bulb tofu</span> <span class="match_end">quinoa palo santo</span> fam wolf try-hard whatever.</span>'
    );
  });
});

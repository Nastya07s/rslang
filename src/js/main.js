/* eslint-disable linebreak-style */

import Api from './api';
import Round from './view/Round';

const api = new Api();

api.checkLogin().then((user) => {
  // Already logged in
  console.log(user);
}, () => {
  // Redirect to login
});

const round = new Round();
const textData = {
  word: 'alien',
  transcript: '[ey76465we]',
  translation: 'пришелец',
  englishPhrase: 'Alien is a good person.',
  russianPhrase: 'Пришелец хороший человек',
  words: [{ id: 1, word: 'Alien' }, { id: 2, word: 'is' }, { id: 3, word: 'a' }, { id: 4, word: 'good' }, { id: 5, word: 'person.' }],
  phrase: [],
};

round.on('droped', (e) => {
  let dropedWord = textData.words.find((word) => word.id === Number(e.word));
  if (!dropedWord) {
    dropedWord = textData.phrase.find((word) => word.id === Number(e.word));
    textData.phrase = textData.phrase.filter((word) => word.id !== Number(e.word));
  }
  textData.words = textData.words.filter((word) => word.id !== Number(e.word));

  if (e.target) {
    const targetIndex = textData.phrase.indexOf(
      textData.phrase.find((x) => x.id === Number(e.target)),
    );
    textData.phrase.splice(targetIndex, 0, dropedWord);
  } else {
    textData.phrase.push(dropedWord);
  }

  round.puzzleReload(textData.words, textData.phrase);
});

round.initRound(textData);

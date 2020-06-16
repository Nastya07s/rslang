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
  words: ['Alien', 'is', 'a', 'good', 'person.'],
};

round.initRound(textData);

/* eslint-disable no-use-before-define */

export default (data) => ({
  id: getId(data),
  word: data.word,
  degreeOfKnowledge: getRepetition(data),
  countRepetition: getCountRepetition(data),
  becameLearned: getBecameLearned(data),
  transcript: data.transcription,
  translation: data.wordTranslate,
  englishPhrase: getEnglishText(data.textExample),
  russianPhrase: data.textExampleTranslate,
  enAudio: getAudio(data.audioExample),
  wordAudio: getAudio(data.audio),
  words: crashWords(data.textExample),
  phrase: [],
});

const getId = (data) => {
  const i = '_id';
  return data[i] || data.id;
};

const getBecameLearned = (data) => {
  let learned = 0;
  if (data.userWord
        && data.userWord.optional
        && data.userWord.optional.becameLearned) {
    learned = data.userWord.optional.becameLearned;
  }
  return learned;
};

const getCountRepetition = (data) => {
  let count = 0;
  if (data.userWord
        && data.userWord.optional
        && data.userWord.optional.countRepetition) {
    count = data.userWord.optional.countRepetition;
  }
  return count;
};

const getRepetition = (data) => {
  let repetition = 0;
  if (data.userWord
        && data.userWord.optional
        && data.userWord.optional.degreeOfKnowledge) {
    repetition = data.userWord.optional.degreeOfKnowledge;
  }
  return repetition;
};

const getAudio = (audio) => {
  const url = 'https://raw.githubusercontent.com/Gabriellji/rslang-data/master';
  return `${url}/${audio}`;
};

const getEnglishText = (textExample) => textExample
  .replace('<b>', '')
  .replace('</b>', '');

const crashWords = (textExample) => textExample
  .replace('<b>', '')
  .replace('</b>', '')
  .split(' ')
  .sort(() => 0.5 - Math.random())
  .map((word, id) => ({ word, id }));

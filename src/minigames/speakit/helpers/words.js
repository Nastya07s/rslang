// Делает всё то же, что и Таня, только используя aggregatedWords
import performRequests from 'app/js/utils/perform-requests';
import api from 'app/js/api';

const MAX_DEGREE_OF_KNOWLEDGE = 5;
const MAX_ROUND = 29;
const MAX_DIFFICULTY = 5;

const mutateData = (parentData, field, newData) => {
  const linkToParentData = parentData;

  linkToParentData[field] = newData;
};

const initUserWord = (rawWordData) => {
  const {
    group: difficulty,
    _id: wordId,
  } = rawWordData;
  const data = {
    difficulty: String(difficulty),
    optional: {
      countRepetition: 1,
      isDelete: false,
      isHard: false,
      isReadyToRepeat: false,
      lastRepetition: Date.now(),
      degreeOfKnowledge: 0,
      becameLearned: 0,
    },
  };

  mutateData(rawWordData, 'userWord', data);

  performRequests([api.createUserWord.bind(api, wordId, data)]);
};

const updateRepetition = (rawWordData) => {
  const {
    userWord,
    _id: wordId,
  } = rawWordData;

  if (!userWord) {
    initUserWord(rawWordData);
    return;
  }

  const {
    optional: word,
  } = userWord;

  word.countRepetition += 1;
  word.lastRepetition = Date.now();

  mutateData(rawWordData, 'userWord', userWord);

  performRequests([api.updateUserWordById.bind(api, wordId, userWord)]);
};

const updateKnowledge = (rawWordData) => {
  const {
    userWord,
    _id: wordId,
  } = rawWordData;

  if (!userWord) {
    initUserWord(rawWordData);
    return;
  }

  const {
    optional: word,
  } = userWord;

  const willBecomeLearned = word.degreeOfKnowledge === MAX_DEGREE_OF_KNOWLEDGE - 1;

  if (willBecomeLearned) {
    word.becameLearned = Date.now();
  }

  const isDegreeOfKnowledgeInBound = word.degreeOfKnowledge < MAX_DEGREE_OF_KNOWLEDGE;

  if (isDegreeOfKnowledgeInBound) {
    word.degreeOfKnowledge += 1;
  }

  mutateData(rawWordData, 'userWord', word);

  performRequests([api.updateUserWordById.bind(api, wordId, userWord)]);
};

export default {
  MAX_DEGREE_OF_KNOWLEDGE,
  MAX_ROUND,
  MAX_DIFFICULTY,
  initUserWord,
  updateRepetition,
  updateKnowledge,
};

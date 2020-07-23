import setters from './setters';
import getters from './getters';
import eventEmitter from '../services/eventEmitter';

import calculations from '../helpers/roundCalculations';
import createRoundsList from '../helpers/userWords';
import settingsMode from './settings_options';

export default {
  nextStep() {
    const { group, round, step } = getters.getRoundInfo();
    const { quantityGroup, quantityRound } = getters.getRoundLimit();
    let wordsLength;
    if (getters.getLearningMode() !== 'mix') {
      wordsLength = getters.getWordsLength();
    }
    wordsLength = getters.getWordsLengthMix();
    const gameComponents = [
      { current: step, limit: wordsLength - 1, setter: setters.setStep },
      { current: round, limit: quantityRound, setter: setters.setRound },
      { current: group, limit: quantityGroup, setter: setters.setGroup },

    ];

    const isNotEnd = gameComponents.reduce(
      (val, x) => (val === 0 ? x.setter(calculations(x.current, x.limit)) : 1), 0,
    );
    if (!isNotEnd) {
      eventEmitter.emit('endOfRound');
    }
  },

  extractPuzzleWord(id) {
    const search = (words) => words.find((word) => word.id === id);
    const filter = (words) => words.filter((word) => word.id !== id);

    const result = search(getters.getDragWords()) || search(getters.getDropWords());
    setters.setDragWords(filter(getters.getDragWords()));
    setters.setDropWords(filter(getters.getDropWords()));

    return result;
  },

  dropPuzzleWord(word, before) {
    if (before) {
      const index = getters.getDropWords().indexOf(
        getters.getDropWords().find((x) => x.id === before),
      );
      const updated = getters.getDropWords();
      updated.splice(index, 0, word);
      setters.setDropWords(updated);
    } else {
      setters.setDropWords([...getters.getDropWords(), word]);
    }
  },

  async loadWords(api) {
    const mode = getters.getLearningMode();
    let filter = {};
    if (mode === 'old') {
      filter = settingsMode.old;
    }
    if (mode === 'learning') {
      filter = settingsMode.learning;
    }
    if (mode === 'new') {
      filter = settingsMode.new;
    }
    let userWords = [];
    let result = [];
    if (mode !== 'new') {
      userWords = await api.getUsersAggregatedWords({ wordsPerPage: 600, filter });
      const shuffle = userWords[0].paginatedResults.sort(() => 0.5 - Math.random()).slice(0, 20);
      result = createRoundsList(shuffle);
    } else {
      userWords = await api.getUsersAggregatedWords({ wordsPerPage: 20, filter });
      result = createRoundsList(userWords[0].paginatedResults);
    }
    return setters.setWordsList(result);
  },

  async loadMixWords(api, group, round) {
    const newWords = await api.getWords(group, round);

    setters.addWordsList(group, round, newWords);
  },

  async isUserWord(api, id) {
    const word = await api.getUsersAggregatedWordsById(id);
    return word[0].userWord;
  },

  createUserWords(api, group, list) {
    list.forEach((word) => {
      api.createUserWord(word.id, {
        difficulty: String(group),
        optional: {
          countRepetition: 1,
          isHard: false,
          isDelete: false,
          isReadyToRepeat: false,
          degreeOfKnowledge: 0,
          lastRepetition: Date.now(),
          becameLearned: 0,
        },
      });
    });
  },

  updateUserWords(api, word, isCorrect) {
    const { group } = getters.getRoundInfo();
    api.updateUserWordById(word.id, {
      difficulty: String(group),
      optional: {
        countRepetition: word.countRepetition + 1,
        degreeOfKnowledge: isCorrect && word.degreeOfKnowledge < 5
          ? word.degreeOfKnowledge + 1 : word.degreeOfKnowledge,
        lastRepetition: Date.now(),
        becameLearned: Number(word.degreeOfKnowledge) === 4 && isCorrect
          ? Date.now() : word.becameLearned,
      },
    });
  },

  setQuickStatistic(api, word, isCorrect) {
    this.updateUserWords(api, word, isCorrect);
    if (!isCorrect) {
      setters.setInCorrect(word);
    } else {
      setters.setCorrect(word);
    }
  },
};

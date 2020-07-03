
import setters from './setters';
import getters from './getters';
import eventEmitter from '../services/eventEmitter';

import calculations from '../helpers/roundCalculations';
import createRoundsList from '../helpers/userWords';
import settingsMode from './settings_options';

export default {
  nextStep() {
    const { group, round, step } = getters.getRoundInfo();
    const { quantityGroup, quantityRound, quantityStep } = getters.getRoundLimit();

    const gameComponents = [
      { current: step, limit: quantityStep, setter: setters.setStep },
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
    const userWords = await api.getUsersAggregatedWords(0, 20, false, filter);
    const result = createRoundsList(userWords);
    return setters.setWordsList(result);
  },

  async loadMixWords(api, group, round) {
    const newWords = await api.getWords(group, round);
    setters.addWordsList(group, round, newWords);
    // const oldWords = await api.getUsersAggregatedWords(0, 20, false, settingsMode.learning);
    // if (!oldWords) {
    //   this.createUserWords(api, group, newWords);
    // }
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
          isHard: false,
          isDelete: false,
          isReadyToRepeat: false,
          countRepetition: 0,
          lastRepetition: Date.now(),
        },
      });
    });
  },
};

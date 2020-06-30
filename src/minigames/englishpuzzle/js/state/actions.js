
import setters from './setters';
import getters from './getters';
import eventEmitter from '../servises/eventEmitter';

import calculations from '../helpers/roundCalculations';
import { filterLearnedWords, createRoundsList } from '../helpers/userWords';

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

  async loadOldWords(api) {
    const userWords = await api.getUsersAggregatedWords();
    const filteredWords = filterLearnedWords(userWords);
    const result = createRoundsList(filteredWords);

    return setters.setWordsList(result);
  },

  async loadNewWords(api, group, round) {
    const newWords = await api.getWords(group, round);
    setters.addWordsList(group, round, newWords);
    this.createUserWords(api, group, newWords);
  },

  // async loadWord() {

  // },

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

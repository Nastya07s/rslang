import eventEmitter from '../services/eventEmitter';
import store from './store';

import wordTransformer from '../helpers/wordTransformer';
import getters from './getters';

export default {
  ready() {
    store.isReady = true;
    eventEmitter.emit('stateReady', store.isReady);
    return store.isReady;
  },

  setLimits(quantityGroup, quantityRound, quantityStep) {
    store.settings.roundLimit = { quantityGroup, quantityRound, quantityStep };
    eventEmitter.emit('changeSettings', store.settings.roundLimit);
    return store.settings.roundLimit;
  },

  setLearningMode(mode) {
    store.settings.learningMode = mode;
    eventEmitter.emit('changeLearningMode', mode);
    return mode;
  },

  setGroup(group) {
    store.roundInfo.group = group;
    eventEmitter.emit('changeGroup', store.roundInfo);
    return store.roundInfo;
  },

  setRound(round) {
    store.roundInfo.round = round;
    eventEmitter.emit('changeRound', store.roundInfo);
    return store.roundInfo;
  },

  setStep(step) {
    store.roundInfo.step = step;
    eventEmitter.emit('changeStep', store.roundInfo);
    return store.roundInfo;
  },

  setRoundInfo(group, round, step) {
    this.setGroup(group);
    this.setRound(round);
    this.setStep(step);
    return { group, round, step };
  },

  setWordsList(list) {
    store.cache.words = list;
    eventEmitter.emit('changeWordsList', list);
    return list;
  },

  addWordsList(group, round, list) {
    if (!store.cache.words[group]) {
      store.cache.words[group] = [];
    }
    store.cache.words[group][round] = list;
    eventEmitter.emit('changeWordsList', store.cache.words);
    return store.cache.words;
  },

  setWord() {
    const { group, round, step } = getters.getRoundInfo();
    const data = store.cache.words[group][round][step];
    store.word = wordTransformer(data);
    eventEmitter.emit('changeWord', store.word);
    return store.word;
  },

  setDragWords(arr) {
    store.word.words = arr;
    eventEmitter.emit('changeDragWord', store.word.words);
    return store.word.words;
  },

  setDropWords(arr) {
    store.word.phrase = arr;
    eventEmitter.emit('changeDropWord', store.word.phrase);
    return store.word.phrase;
  },

  setCorrect(word) {
    store.quickStatistic.correct.push(word);
    eventEmitter.emit('changeStatistic', store.quickStatistic);
    return store.quickStatistic;
  },

  setInCorrect(word) {
    store.quickStatistic.incorrect.push(word);
    eventEmitter.emit('changeStatistic', store.quickStatistic);
    return store.quickStatistic;
  },

  setGameOver() {
    store.gameOver = true;
  },

};

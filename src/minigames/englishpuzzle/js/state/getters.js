import store from './store';

export default {
  getWord() {
    return store.word;
  },

  getDragWords() {
    return this.getWord().words;
  },

  getDropWords() {
    return this.getWord().phrase;
  },

  getEnPhrase() {
    return store.word.englishPhrase;
  },

  getAudioWord() {
    return store.word.wordAudio;
  },

  getAudioPhrase() {
    return store.word.enAudio;
  },

  getRoundInfo() {
    return store.roundInfo;
  },

  getRoundLimit() {
    return store.settings.roundLimit;
  },

  getLearningMode() {
    return store.settings.learningMode;
  },

  getQuickStatistic() {
    return store.quickStatistic;
  },
};

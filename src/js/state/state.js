import eventMixin from '../mixins/eventMixin';

const state = {
  isReady: false,
  store: {
    roundInfo: { group: 0, round: 0, word: 0 },
    word: {},
  },

  ready() {
    this.isReady = true;
    this.emit('stateReady');
  },

  setWord(word) {
    this.store.word = word;
    this.emit('wordLoaded');
  },

  getWord() {
    return this.store.word;
  },

  setRoundInfo(group, round, word) {
    this.store.roundInfo = { group, round, word };
  },

  getRoundInfo() {
    return this.store.roundInfo;
  },
};


Object.assign(state, eventMixin);


export default state;

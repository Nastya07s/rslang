import eventMixin from '../mixins/eventMixin';

const state = {
  isReady: false,
  store: {
    roundInfo: { group: 0, round: 0, word: 0 },
    word: {
      word: '',
      transcript: '',
      translation: '',
      englishPhrase: '',
      russianPhrase: '',
      enAudio: '',
      wordAudio: '',
      words: [],
      phrase: [],
    },
  },

  ready() {
    this.isReady = true;
    this.emit('stateReady');
  },

  setWord(data) {
    this.store.word = {
      word: data.word,
      transcript: data.transcription,
      translation: data.wordTranslate,
      englishPhrase: data.textExample
        .replace('<b>', '')
        .replace('</b>', ''),
      russianPhrase: data.textExampleTranslate,
      enAudio: `https://raw.githubusercontent.com/Gabriellji/rslang-data/master/${data.audioExample}`,
      wordAudio: `https://raw.githubusercontent.com/Gabriellji/rslang-data/master/${data.audio}`,
      words: data.textExample
        .replace('<b>', '')
        .replace('</b>', '')
        .split(' ')
        .map((word, id) => ({ word, id })),
      phrase: [],
    };
    this.emit('wordLoaded', this.store.word);
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

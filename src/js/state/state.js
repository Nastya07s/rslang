import eventMixin from '../mixins/eventMixin';

const state = {
  isReady: false,
  store: {
    roundInfo: { group: 0, round: 0, word: 0 },
    word: {
      word: 'alien',
      transcript: '[ey76465we]',
      translation: 'пришелец',
      englishPhrase: 'Alien is a good person.',
      russianPhrase: 'Пришелец хороший человек',
      words: [
        { id: 1, word: 'Alien' },
        { id: 2, word: 'is' },
        { id: 3, word: 'a' },
        { id: 4, word: 'good' },
        { id: 5, word: 'person.' },
      ],
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

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

  getOriginWords() {
    return this.getWord().words;
  },

  setOriginWords(arr) {
    this.store.word.words = arr;
  },

  getMovedWords() {
    return this.getWord().phrase;
  },

  setMovedWords(arr) {
    this.store.word.phrase = arr;
  },

  getWord() {
    return this.store.word;
  },

  dropPuzzleWord(word, before) {
    if (before) {
      const index = this.getMovedWords().indexOf(
        this.getMovedWords().find((x) => x.id === before),
      );
      const updated = this.getMovedWords();
      updated.splice(index, 0, word);
      this.setMovedWords(updated);
    } else {
      this.setMovedWords([...this.getMovedWords(), word]);
    }
  },

  extractPuzzleWord(id) {
    let result = this.getOriginWords().find((word) => word.id === id);
    if (result) {
      this.setOriginWords(this.getOriginWords().filter((word) => word.id !== id));
      return result;
    }
    result = this.getMovedWords().find((word) => word.id === id);
    this.setMovedWords(this.getMovedWords().filter((word) => word.id !== id));
    return result;
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

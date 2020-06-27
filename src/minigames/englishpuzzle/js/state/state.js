import eventMixin from '../mixins/eventMixin';

const state = {
  isReady: false,
  isDontKnow: false,
  isChecked: false,
  store: {
    settings: {
      quantityGroup: 6,
      quantityRound: 30,
      quantityWord: 20,
    },
    roundInfo: { word: 0, round: 0, group: 0 },
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

  setSettings(quantityGroup, quantityRound, quantityWord) {
    this.store.settings = { quantityGroup, quantityRound, quantityWord };
  },

  ready() {
    this.isReady = true;
    this.emit('stateReady');
  },

  getEnPhrase() {
    return this.store.word.englishPhrase;
  },

  nextWord() {
    if (this.store.roundInfo.word < this.store.settings.quantityWord - 1) {
      this.store.roundInfo.word += 1;
    } else {
      this.store.roundInfo.word = 0;
      if (this.store.roundInfo.round < this.store.settings.quantityRound - 1) {
        this.store.roundInfo.round += 1;
        this.emit('changeImage');
      } else {
        this.store.roundInfo.round = 0;
        if (this.store.roundInfo.group < this.store.settings.quantityGroup - 1) {
          this.store.roundInfo.group += 1;
        } else {
          this.emit('gameOver');
          this.store.roundInfo.group = 0;
        }
      }
    }
    this.emit('setRound', { group: this.store.roundInfo.group, round: this.store.roundInfo.round, word: this.store.roundInfo.word });
  },

  setWord(data) {
    let repetition = 0;
    if (data.userWord && data.userWord.optional && data.userWord.optional.countRepetition) {
      repetition = data.userWord.optional.countRepetition;
    }
    const i = '_id';
    this.store.word = {
      id: data[i] || data.id,
      word: data.word,
      countRepetition: repetition,
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
        .sort(() => 0.5 - Math.random())
        .map((word, id) => ({ word, id })),
      phrase: [],
    };
    this.emit('wordLoaded', this.store.word);
    console.log(this.store.word);
  },

  getAudioWord() {
    return this.store.word.wordAudio;
  },

  getAudioPhrase() {
    return this.store.word.enAudio;
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
    this.emit('setRound', { group, round, word });
    this.store.roundInfo = { group, round, word };
  },

  getRoundInfo() {
    return this.store.roundInfo;
  },
};


Object.assign(state, eventMixin);


export default state;

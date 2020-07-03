import Round from './view/Round';
import eventEmitter from './services/eventEmitter';

export default {
  init(state, api, settings) {
    this.state = state;
    this.api = api;
    this.settings = settings;
    this.round = new Round();
    this.audio = new Audio();

    this.setListeners();

    this.load();
  },

  setListeners() {
    eventEmitter.on('changeMode', this.loaded.bind(this));
    eventEmitter.on('userStart', this.start.bind(this));
    eventEmitter.on('sayWord', (() => {
      new Audio(this.state.getters.getAudioWord()).play();
    }));
    eventEmitter.on('sayPhrase', (() => {
      new Audio(this.state.getters.getAudioPhrase()).play();
    }));
    eventEmitter.on('dontKnow', this.onDontKnow.bind(this));
    eventEmitter.on('droped', this.onDropped.bind(this));
    eventEmitter.on('check', this.onCheck.bind(this));
  },

  async load() {
    this.round.spinnerOn();
    await this.settings.getSettings();
    let mode = this.settings.learningMode;
    mode = 'mix';
    this.state.setters.setLearningMode(mode);

    if (mode === 'old') {
      await this.state.actions.loadWords(this.api);
    }
    this.state.setters.setLearningMode(mode);
    if (mode === 'new') {
      await this.state.actions.loadWords(this.api);
    }

    if (mode === 'learning') {
      await this.state.actions.loadWords(this.api);
    }
    this.loaded();
  },

  loaded() {
    if (this.state.getters.getLearningMode() === 'mix') {
      this.round.settingsFormOn();
    } else {
      this.round.settingsFormOff();
    }
    this.round.spinnerOff();
  },

  async start() {
    this.round.spinnerOn();
    this.round.closeStartScreen();
    if (this.state.getters.getLearningMode() === 'mix') {
      const { group, round } = this.state.getters.getRoundInfo();
      await this.state.actions.loadMixWords(this.api, group, round);
    }
    this.roundStart();
  },

  async roundStart() {
    this.state.store.isDontKnow = false;
    this.state.store.isChecked = false;
    const currentWord = this.state.setters.setWord();
    const isUserWord = await this.state.actions.isUserWord(this.api, currentWord.id);
    if (!isUserWord) {
      const { group } = this.state.getters.getRoundInfo();
      this.state.actions.createUserWords(this.api, group, [currentWord]);
    }
    this.round.spinnerOff();
  },

  onCheck() {
    if (this.state.getters.getDragWords().length === 0) {
      const expectedArr = this.state.getters.getEnPhrase().split(' ');
      const correctMask = [];

      this.state.getters.getDropWords().forEach((word, i) => {
        correctMask.push(word.word === expectedArr[i]);
      });
      this.round.setCorrectMask(correctMask);
      const isCorrect = correctMask.reduce((acc, el) => acc && el, true);

      if (!this.state.store.word.isChecked) {
        // this.model.setStatistic(
        //   state.getWord(),
        //   isCorrect && !state.isDontKnow,
        // );
        this.state.store.word.isChecked = true;
      }
      if (isCorrect) {
        // const { step } = this.state.getters.getRoundInfo();
        // if (Number(step) === this.state.store.settings.roundLimit.quantityStep - 1) {
        //   setTimeout(this.quickStat.show(this.model.statistic.data), 2000);
        // } else {
        setTimeout(this.nextStep.bind(this), 2000);
        // }
      }
    }
  },

  nextStep() {
    this.state.actions.nextStep();
    this.roundStart();
    this.round.spinnerOn();
  },

  onDontKnow() {
    this.round.showTranslate();
    this.state.store.word.isDontKnow = true;
  },

  onDropped(e) {
    const droppedWord = this.state.actions.extractPuzzleWord(Number(e.word));
    this.state.actions.dropPuzzleWord(droppedWord, Number(e.target));
    this.round.puzzleReload(this.state.getters.getDragWords(), this.state.getters.getDropWords());
  },
};

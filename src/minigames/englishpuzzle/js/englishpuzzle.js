import GlobalStatistic from 'app/js/statistics';
import Round from './view/Round';
import QuickStatistic from './view/OuickStatistic';
import eventEmitter from './services/eventEmitter';


export default {
  init(state, api, settings) {
    this.state = state;
    this.api = api;
    this.settings = settings;
    this.globalStatisctic = new GlobalStatistic();
    this.round = new Round();
    this.audio = new Audio();
    this.quickStatistic = new QuickStatistic();

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
    eventEmitter.on('endOfRound', this.gameOver.bind(this));
    eventEmitter.on('goHome', this.goHome.bind(this));
    eventEmitter.on('continue', this.nextRound.bind(this));
    eventEmitter.on('userSetGroup', (group) => {
      this.state.setters.setGroup(group);
    });
    eventEmitter.on('userSetRound', (round) => {
      this.state.setters.setRound(round);
    });
    eventEmitter.on('userSetVolume', () => {
      this.setMute(!this.getMute());
      this.settings.postUpdates();
      if (this.getMute()) {
        this.round.volumeOff();
      } else {
        this.round.volumeUp();
      }
    });
  },

  setUserVolume() {
    if (this.getMute()) {
      this.round.volumeOff();
    } else {
      this.round.volumeUp();
    }
  },

  getMute() {
    return this.settings.minigames.englishPuzzle.isMute;
  },

  setMute(value) {
    this.settings.minigames.englishPuzzle.isMute = value;
    this.settings.postUpdates();
  },

  async load() {
    this.round.spinnerOn();
    this.setUserVolume();
    const mode = this.settings.learningMode;
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
    } else {
      this.state.setters.setWordOptions(
        isUserWord.optional.countRepetition,
        isUserWord.optional.degreeOfKnowledge,
        isUserWord.optional.becameLearned,
      );
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
        this.state.actions.setQuickStatistic(
          this.api,
          this.state.getters.getWord(),
          isCorrect && !this.state.getters.getWord().isDontKnow,
        );
        this.state.store.word.isChecked = true;
      }
      if (isCorrect) {
        if (!this.getMute()) {
          this.round.playWord('/assets/audio/puzzle/points.wav');
        }
        setTimeout(this.nextStep.bind(this), 2000);
      }
    }
  },

  nextStep() {
    this.state.actions.nextStep();
    if (!this.state.store.gameOver) {
      this.roundStart();
      this.round.spinnerOn();
    }
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

  gameOver() {
    this.state.setters.setGameOver();
    this.quickStatistic.show(this.state.getters.getQuickStatistic());
    this.globalStatisctic.updateGameResult('englishpuzzle', this.state.getters.getQuickStatistic().correct.length);
  },

  nextRound() {
    window.location.href = '/englishpuzzle';
  },

  goHome() {
    window.location.href = '/app';
  },
};

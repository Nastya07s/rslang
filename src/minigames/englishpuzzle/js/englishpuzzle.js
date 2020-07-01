import Round from './view/Round';
import eventEmitter from './servises/eventEmitter';

export default {
  init(state, api, settings) {
    this.state = state;
    this.api = api;
    this.settings = settings;
    this.round = new Round();

    this.load();
  },

  setListeners() {
    eventEmitter.on('changeMode', this.loaded().bind(this));
    eventEmitter.on('userStart', this.start().bind(this));
  },

  async load() {
    this.round.spinnerOn();
    await this.settings.getSettings();
    let mode = this.settings.learningMode;
    this.state.settters.setLearningMode(mode);

    if (mode === 'old') {
      const oldWords = await this.state.actions.loadOldWords(this.api);
      mode = oldWords.length > 0 ? mode : 'new';
    }
    this.state.setters.setLearningMode(mode);
    this.loaded();
  },

  loaded() {
    if (this.state.getters.getLearningMode() !== 'old') {
      this.round.settingsFormOff();
    } else {
      this.round.settingsFormOnn();
    }
    this.round.spinnerOff();
  },

  async start() {
    this.round.spinnerOn();
    this.round.closeStartScreen();
    if (this.state.getters.getLearningMode() !== 'old') {
      const { group, round } = this.state.getters.getRoundInfo();
      await this.state.actions.loadNewWords(this.api, group, round);
    }
    this.round();
  },

  round() {
    this.state.store.isDontKnow = false;
    this.state.store.isChecked = false;
    this.state.setters.setWord();
    this.round.spinnerOf();
  },
};

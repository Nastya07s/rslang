
export default {
  init(state, api, settings) {
    this.state = state;
    this.api = api;
    this.settings = settings;
  },

  async load() {
    await this.settings.getSettings();
    let mode = this.settings.learningMode;
    this.state.settters.setLearningMode(mode);

    if (mode === 'old') {
      const oldWords = await this.state.actions.loadOldWords(this.api);
      mode = oldWords.length > 0 ? mode : 'new';
    }
    this.state.setters.setLearningMode(mode);
  },
};

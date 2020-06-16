class Words {
  constructor(api) {
    this.api = api;
    this.cache = [[], [], [], [], [], []];
  }

  load(group, round) {
    if (!this.cache[group][round]) {
      this.cache[group][round] = this.api.getWords(group, round);
    }
    return this.cache[group][round];
  }

  loadWord(group, round, word) {
    return this.load(group, round)[word];
  }
}

export default Words;

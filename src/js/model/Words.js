class Words {
  constructor(api) {
    this.api = api;
    this.cache = [[], [], [], [], [], []];
  }

  load(group, round) {
    return new Promise((resolve) => {
      if (!this.cache[group][round]) {
        this.api.getWords(group, round)
          .then((result) => {
            this.cache[group][round] = result;
            resolve(this.cache[group][round]);
          });
      }
    });
  }

  loadWord(group, round, word) {
    return new Promise((resolve) => {
      this.load(group, round)
        .then((loadedRound) => {
          resolve(loadedRound[word]);
        });
    });
  }
}

export default Words;

class Words {
  constructor(api) {
    this.api = api;
    this.stdCache = [[], [], [], [], [], []];
    this.usrCache = [];
  }

  setMode(mode) {
    this.mode = mode;
  }

  load(group, round) {
    return new Promise((resolve) => {
      if (!this.stdCache[group][round]) {
        this.api.getWords(group, round)
          .then((result) => {
            this.stdCache[group][round] = result;
            resolve(this.stdCache[group][round]);
          });
      } else {
        resolve(this.stdCache[group][round]);
      }
    });
  }

  loadWord(group, round, word) {
    return new Promise((resolve) => {
      if (this.mode === 'standart') {
        this.load(group, round)
          .then((loadedRound) => {
            resolve(loadedRound[word]);
          });
      } else {
        this.loadUserList()
          .then((loadedRound) => {
            resolve(loadedRound[word]);
          });
      }
    });
  }

  loadUserList() {
    return new Promise((resolve) => {
      if (!this.usrCache.length) {
        this.api.getUserWords()
          .then((result) => result.filter((word) => word.countRepetition < 4))
          .then((result) => Promise.all(
            result.reduce(
              (acc, word) => acc.push(this.api.getUserWordById(word.wordId)),
              [],
            ),
          ))
          .then((result) => {
            this.usrCache = result;
            resolve(this.usrCache);
          });
      }
      return this.usrCache;
    });
  }
}

export default Words;

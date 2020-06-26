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
            result.forEach((word) => {
              this.api.createUserWord(word.id, {
                difficulty: String(group),
                optional: {
                  isHard: false,
                  isDelete: false,
                  isReadyToRepeat: false,
                  countRepetition: 0,
                  lastRepetition: Date.now(),
                },
              });
            });
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
    console.log('loadList', this.api);
    return new Promise((resolve) => {
      if (!this.usrCache.length) {
        this.api.getUserWords()
          .then((result) => Promise.all(
            result.reduce(
              (acc, word) => [...acc, this.api.getUserWordById(word.wordId)],
              [],
            ),
          ))
          .then((result) => {
            this.usrCache = result.filter((word) => {
              if (!word.optional) {
                return false;
              }
              return word.optional.countRepetition < 4;
            });
            resolve(this.usrCache);
          });
      }
      return this.usrCache;
    });
  }
}

export default Words;

class Model {
  constructor(words, statistic, state) {
    this.words = words;
    this.state = state;
    this.statistic = statistic;
  }

  setGameMode(mode, options = []) {
    switch (mode) {
      case 'standart':
        this.words.setMode('standart');
        this.state.setSettings(6, 30, 20);
        this.setRoundData();
        break;
      case 'repeat':
        this.words.setMode('repeat');
        this.state.setSettings(...options);
        this.setRoundData();
        break;
      default:
        this.checkMode();
        break;
    }
  }

  async checkMode() {
    const userList = await this.words.loadUserList();
    if (userList.length > 0) {
      this.setGameMode('repeat', [0, 0, userList.length]);
    } else {
      this.setGameMode('standart');
    }
  }

  setRoundData() {
    const { group, round, word } = this.state.getRoundInfo();
    this.words.loadWord(group, round, word)
      .then((wordData) => {
        this.state.setWord(wordData);
      });
  }

  setStatistic(word, isCorrect) {
    console.log(isCorrect);
    if (isCorrect) {
      this.statistic.addCorrect(word, this.state.getRoundInfo().group);
    } else {
      this.statistic.addIncorrect(word);
    }
    console.log(this.statistic.data);
  }
}

export default Model;

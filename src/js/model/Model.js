class Model {
  constructor(words, statistic, state) {
    this.words = words;
    this.state = state;
    this.statistic = statistic;
  }

  setRoundData() {
    const { group, round, word } = this.state.getRoundInfo();
    this.words.loadWord(group, round, word)
      .then((wordData) => {
        this.state.setWord(wordData);
      });
  }

  setStatistic(word, isCorrect) {
    if (isCorrect) {
      this.statistic.addCorrect(word);
    } else {
      this.statistic.addIncorrect(word);
    }
    console.log(this.statistic.data);
  }
}

export default Model;

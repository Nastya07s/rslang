class Model {
  constructor(words, state) {
    this.words = words;
    this.state = state;
  }

  setRoundData() {
    const { group, round, word } = this.state.getRoundInfo();
    this.words.loadWord(group, round, word)
      .then((wordData) => {
        this.state.setWord(wordData);
      });
  }
}

export default Model;

class Model {
  constructor(words, state) {
    this.words = words;
    this.state = state;
  }

  setRoundData() {
    const { group, round, word } = this.state.getRoundInfo();
    this.state.setWord(this.words.loadWord(group, round, word));
  }
}

export default Model;

class Statistic {
  constructor(api) {
    this.api = api;
    this.data = {
      correct: [],
      incorrect: [],
    };
  }

  addCorrect(word) {
    this.data.correct.push(word);
  }

  addIncorrect(word) {
    this.data.incorrect.push(word);
  }
}

export default Statistic;

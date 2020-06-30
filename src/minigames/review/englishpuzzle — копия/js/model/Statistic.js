class Statistic {
  constructor(api) {
    this.api = api;
    this.data = {
      correct: [],
      incorrect: [],
    };
  }

  resetStatistic() {
    this.data.correct = [];
    this.data.incorrect = [];
  }

  addCorrect(word, group) {
    this.data.correct.push(word);
    this.api.updateUserWordById(word.id, {
      difficulty: String(group),
      optional: {
        isHard: false,
        isDelete: false,
        isReadyToRepeat: false,
        countRepetition: word.countRepetition + 1,
        lastRepetition: Date.now(),
      },
    });
  }

  addIncorrect(word) {
    this.data.incorrect.push(word);
  }

  // getMainStatistic(word) {
  //   return new Promise((resolve) => {
  //     this.api.getStatistics(word.id, {
  //       learnedWords: 0,
  //       optional: {
  //         englishpuzzle: {
  //           totalTimesPlayed: 3,
  //           lastGameResult: 80,
  //           lastGameDate: 0,
  //         },
  //       },
  //     });
  //   });
  // }

  // setMainStatistic(word) {
  //   this.api.getStatistics(word.id, {
  //     learnedWords: 0,
  //     optional: {
  //       englishpuzzle: {
  //         totalTimesPlayed: 3,
  //         lastGameResult: Number(this.data.correct),
  //         lastGameDate: new Date().toLocaleDateString(),
  //       },
  //     },
  //   });
  // }
}

export default Statistic;

import api from './api';

export default class Statistics {
  /**
   *
   * @param config {}
   */
  constructor() {
    this.init();
  }

  async init() {
    this.api = api;
    // Returns 404 error if not statistics saved
    await this.getStatistics()
      .then((response) => {
        this.statistics = response;
        this.initStatistics();
        return response;
      }, () => {
        // Saving new statistics for User if wasn't created before
        this.statistics = {
          learnedWords: 0,
          optional: {},
        };
        this.initStatistics();
      });
  }

  initStatistics() {
    const gamesArray = ['speakit', 'englishPuzzle', 'savannah', 'audioCall', 'sprint', 'fillword'];
    let isChangedStatistics = false;
    gamesArray.forEach((element) => {
      if (!this.statistics.optional[element]) {
        this.statistics.optional[element] = {
          totalTimesPlayed: 0,
          lastGameResult: 0,
          lastGameDate: null,
        };
        isChangedStatistics = true;
      }
    });
    if (isChangedStatistics) {
      this.updateStatistics(this.statistics);
    }
  }

  getStatistics() {
    return this.api.getStatistics();
  }

  /**
   *
   * @param statistics { learnedWords, optional}
   * @returns {Promise<void>}
   */
  updateStatistics(statistics) {
    this.statistics = statistics;
    delete this.statistics.id;
    return this.api.upsertStatistics(statistics);
  }

  async getGameStatistics(gameName) {
    const statistics = await this.getStatistics();
    if (statistics.optional) {
      return statistics.optional[gameName] || {};
    }
    return {};
  }

  async updateGameStatistics(gameName, statistics) {
    this.statistics.optional[gameName] = statistics;
    return this.updateStatistics(this.statistics);
  }

  updateGameResult(gameName, gameResult) {
    this.statistics.optional = this.statistics.optional || {};
    this.statistics.optional[gameName] = this.statistics.optional[gameName] || {};
    const gameStatistics = this.statistics.optional[gameName];
    gameStatistics.totalTimesPlayed = gameStatistics.totalTimesPlayed || 0;
    gameStatistics.lastGameResult = gameResult;
    gameStatistics.lastGameDate = Date.now();
    gameStatistics.totalTimesPlayed += 1;
    return this.updateGameStatistics(gameName, gameStatistics);
  }
}

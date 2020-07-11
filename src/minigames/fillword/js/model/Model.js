import api from '../../../../js/api';
import Settings from '../../../../js/settings';
import Words from '../../../../js/words';
import Statistics from '../../../../js/statistics';

const MAX_SCORE = 'max-score';
const GAME_NAME = 'fillWord';

export default class Model {
  constructor() {
    this.settings = new Settings();
    this.wordsService = new Words({
      settings: this.settings,
      gameNameInSettings: GAME_NAME,
    });
    this.round = 0;
    this.level = 0;
    this.gameWords = [];
    this.gameWords2 = [];
    this.arrayCorrectAnswer = [];
    this.arrayIncorrectAnswer = [];
    this.audioMute = false;
    this.fillWordStorage = '';
  }

  init() {
    this.initRoundLevel();
    this.api = api;
    this.api.checkLogin()
      .then(async () => {
        await this.settings.getSettings();
        this.countCorrectAnswer = 0;
        this.totalScore = 0;
        this.maxScore = localStorage.getItem(MAX_SCORE) || 0;
        this.statisticsService = new Statistics();
      }, () => {
        document.location.href = '/';
      });
  }

  async initGame() {
    this.gameWords = [];
    this.gameWords2 = [];
    this.initRoundLevel();
    await this.getWordsList();
    await this.getNewWords();
    console.log(this.gameWords2);
    console.log(this.gameWords);
  }

  async getWordsList() {
    const words = await this.wordsService.getWords(true);
    words.forEach((el) => {
      this.getGameWords(el);
    });
  }

  getGameWords(data) {
    this.gameWords2.push(
      {
        id: data.id,
        en: data.word,
        ru: data.wordTranslate,
      },
    );
  }

  async getNewWords() {
    const data = await api.getUsersAggregatedWords({
      group: Number.parseInt(this.round, 10),
      wordsPerPage: Number.parseInt(this.level, 10),
      filter: {
        $and: [
          { userWord: null },
        ],
      },
    });
    data[0].paginatedResults.forEach((el) => {
      this.addRoundWordsWithSetting(el);
    });
  }

  addRoundWordsWithSetting(data) {
    this.gameWords.push(
      {
        id: data.id,
        en: data.word,
        ru: data.wordTranslate,
      },
    );
  }

  initRoundLevel() {
    this.fillWordStorage = JSON.parse(localStorage.getItem('fillWord'));
    this.round = this.fillWordStorage ? this.fillWordStorage.round : this.round;
    this.level = this.fillWordStorage ? this.fillWordStorage.level : this.level;
  }

  setMuteAudio() {
    this.audioMute = !this.audioMute;
    localStorage.setItem('fillWord',
      JSON.stringify({ round: this.round, level: this.level, audioMute: this.audioMute }));
  }

  setRound(number) {
    this.round = number;
    localStorage.setItem('fillWord',
      JSON.stringify({ round: this.round, level: this.level, audioMute: this.audioMute }));
  }

  setLevel(number) {
    this.level = number;
    localStorage.setItem('fillWord',
      JSON.stringify({ round: this.round, level: this.level, audioMute: this.audioMute }));
  }
}

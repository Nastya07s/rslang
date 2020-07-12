/* eslint-disable no-underscore-dangle */
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
    this.difficultGroup = 0;
    this.level = 0;
    this.gameWord = {};
    this.gameWords = [];
    this.gameWords2 = [];
    this.gameRound = 0;
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
    this.getWord(this.gameWords, this.gameRound);
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
        info: data,
      },
    );
  }

  addCorrectAnswerResult() {
    this.arrayCorrectAnswer.push(this.word);
  }

  addIncorrectAnswer() {
    this.arrayIncorrectAnswer.push(this.word);
  }

  getWord() {
    this.gameWord = {
      id: this.gameWords[this.gameRound].id,
      en: this.gameWords[this.gameRound].en,
      ru: this.gameWords[this.gameRound].ru,
      info: this.gameWords[this.gameRound].info,
    };
  }

  async getNewWords() {
    const data = await api.getUsersAggregatedWords({
      group: Number.parseInt(this.difficultGroup, 10),
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
        id: data._id,
        en: data.word,
        ru: data.wordTranslate,
        info: data,
      },
    );
  }

  initRoundLevel() {
    this.fillWordStorage = JSON.parse(localStorage.getItem('fillWord'));
    this.difficultGroup = this.fillWordStorage ? this.fillWordStorage.round : this.difficultGroup;
    this.level = this.fillWordStorage ? this.fillWordStorage.level : this.level;
  }

  setMuteAudio() {
    this.audioMute = !this.audioMute;
    localStorage.setItem('fillWord',
      JSON.stringify({ round: this.difficultGroup, level: this.level, audioMute: this.audioMute }));
  }

  setRound(number) {
    this.difficultGroup = number;
    localStorage.setItem('fillWord',
      JSON.stringify({ round: this.difficultGroup, level: this.level, audioMute: this.audioMute }));
  }

  setLevel(number) {
    this.level = number;
    localStorage.setItem('fillWord',
      JSON.stringify({ round: this.difficultGroup, level: this.level, audioMute: this.audioMute }));
  }
}

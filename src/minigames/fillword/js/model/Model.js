/* eslint-disable no-underscore-dangle */
import api from '../../../../js/api';
import Settings from '../../../../js/settings';
import Words from '../../../../js/words';
import Statistics from '../../../../js/statistics';
import createField from '../createField/createField';

const MAX_SCORE = 'max-score';
const GAME_NAME = 'fillWord';
const FIELD_LENGTH = 5;
const FIELD_HEIGHT = 6;

export default class Model {
  constructor() {
    this.settings = new Settings();
    this.wordsService = new Words({
      settings: this.settings,
      gameNameInSettings: GAME_NAME,
    });
    this.difficultGroup = 0;
    this.level = 0;
    this.field = [];
    this.coordinate = [];
    this.chooseCoordinate = [];
    this.innerArrWord = [];
    this.gameWord = {};
    this.gameWords = [];
    this.gameWords2 = [];
    this.gameRound = 0;
    this.arrayAnswer = [];
    this.audioMute = false;
    this.fillWordStorage = '';
  }

  init() {
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
    await this.getWordsList();
    await this.getNewWords();
    this.getWord(this.gameWords, this.gameRound);
  }

  initGameField() {
    this.field = createField(this.gameWord.en, FIELD_LENGTH, FIELD_HEIGHT, this.coordinate);
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
        audio: data.audio,
        isCorrect: false,
      },
    );
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

  isCorrectAnswer() {
    this.gameWord.isCorrect = true;
  }

  addAnswerResult() {
    this.arrayAnswer.push(this.gameWord);
  }
}

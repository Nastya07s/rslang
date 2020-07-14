/* eslint-disable no-underscore-dangle */
import api from 'app/js/api';
import settings from 'app/js/settings';
import Words from 'app/js/words';
import Statistics from 'app/js/statistics';
import createField from '../createField/createField';

const GAME_NAME = 'ourGame';
const FIELD_LENGTH = 5;
const FIELD_HEIGHT = 6;

export default class Model {
  constructor() {
    this.settings = settings;
    this.wordsService = new Words({
      settings: this.settings,
      gameNameInSettings: GAME_NAME,
    });
    this.audio = new Audio();
    this.gameSettings = {
      isMute: false,
      difficulty: 0,
      round: 0,
    };
    this.field = [];
    this.coordinate = [];
    this.chooseCoord = [];
    this.gameWord = {};
    this.gameWords = [];
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
        this.statisticsService = new Statistics();
      }, () => {
        document.location.href = '/';
      });
  }

  async initGameWords() {
    this.gameWords = [];
    await this.getWordsList();
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
    if (this.gameWords.length > 10) {
      return;
    }
    this.gameWords.push(
      {
        id: data.id,
        en: data.word,
        ru: data.wordTranslate,
        info: data,
        audio: data.audio,
      },
    );
  }

  getWord() {
    this.gameWord = {
      id: this.gameWords[this.gameRound].id,
      en: this.gameWords[this.gameRound].en,
      ru: this.gameWords[this.gameRound].ru,
      info: this.gameWords[this.gameRound].info,
      audio: this.gameWords[this.gameRound].audio,
      isCorrect: false,
    };
  }

  setMuteAudio() {
    this.audioMute = !this.audioMute;
    this.gameSettings.isMute = this.audioMute;
    this.settings.localUpdates(GAME_NAME, this.gameSettings);
    this.settings.postUpdates();
  }

  setRound(number) {
    this.gameSettings.difficulty = number;
    this.settings.localUpdates(GAME_NAME, this.gameSettings);
    this.settings.postUpdates();
  }

  setLevel(number) {
    this.gameSettings.round = number;
    this.settings.localUpdates(GAME_NAME, this.gameSettings);
    this.settings.postUpdates();
  }

  isCorrectAnswer() {
    this.gameWord.isCorrect = true;
  }

  addAnswerResult() {
    this.arrayAnswer.push(this.gameWord);
  }

  playSound() {
    this.audio.muted = this.audioMute;
    const url = 'https://raw.githubusercontent.com/Gabriellji/rslang-data/master';
    this.audio.src = `${url}/${this.gameWord.audio}`;
    this.audio.play();
  }
}

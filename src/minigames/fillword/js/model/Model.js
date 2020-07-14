/* eslint-disable no-underscore-dangle */
import api from 'app/js/api';
import settings from 'app/js/settings';
import Words from 'app/js/words';
import Statistics from 'app/js/statistics';
import createField from '../createField/createField';

const GAME_NAME = 'fillword';
const FIELD_LENGTH = 5;
const FIELD_HEIGHT = 6;

export default class Model {
  constructor() {
    this.wordsService = new Words({
      settings,
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
    return api.checkLogin()
      .then(async () => {
        await settings.getSettings();
        this.statisticsService = new Statistics();
        this.gameSettings = {
          ...this.gameSettings,
          ...settings.minigames[GAME_NAME],
        };
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
    settings.update(GAME_NAME, this.gameSettings);
  }

  setRound(number) {
    this.gameSettings.difficulty = number;
    settings.update(GAME_NAME, this.gameSettings);
  }

  setLevel(number) {
    this.gameSettings.round = number;
    settings.update(GAME_NAME, this.gameSettings);
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

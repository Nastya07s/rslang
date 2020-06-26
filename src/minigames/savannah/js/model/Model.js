import Api from '../../../../js/api';
import shuffleArray from '../utils/shuffleArray';
import randomNumber from '../utils/randomNumber';
/* eslint no-console: "off" */

const NUMBER_OF_LIVES = 5;
export default class Model {
  constructor() {
    // рассчитать up crystal
    // this.defau
    this.api = new Api();
    this.hearts = 0;
    this.savannahStorage = '';
    this.round = 0;
    this.level = 0; // local storage
    // console.log(this.round, this.level);
    this.valueMoveBg = 0;
    this.valueUpCrystal = 0;
    this.roundWords = [];
    this.helpRoundWords = [];
    this.currentCorrectWord = {
      en: '',
      ru: '',
    };
    this.currentWordsAnswers = [];
    this.currentWordNumber = 0;
    this.stateCrystal = {
      small: 1,
      normal: 2,
      big: 3,
      large: 4,
    };
    // this.init();
  }

  initRoundLevel() {
    this.savannahStorage = JSON.parse(localStorage.getItem('savannah'));
    this.round = this.savannahStorage ? this.savannahStorage.round : this.round;
    this.level = this.savannahStorage ? this.savannahStorage.level : this.level; // local storage
  }

  async init() {
    // all back
    // const res = await this.api.getWords(this.level, this.round);
    this.roundWords = [];
    this.initRoundLevel();
    await this.getDefaultWords();
    // console.log(this.roundWords);
    this.hearts = NUMBER_OF_LIVES;

    this.roundWords = shuffleArray(this.roundWords);
    this.currentWordNumber = this.roundWords.length - 1;
    this.helpDefaultWords = this.roundWords.slice();
    this.valueMoveBg = 100 / this.roundWords.length;// 100 => constan( need fix )
    this.valueUpCrystal = Math.floor(this.roundWords.length / this.stateCrystal.length);
  }

  setRound(number) {
    this.round = number;
    localStorage.setItem('savannah', JSON.stringify({ round: this.round, level: this.level }));
    // add local storage
  }

  setLevel(number) {
    this.level = number;
    localStorage.setItem('savannah', JSON.stringify({ round: this.round, level: this.level }));
  }

  setNextWord() {
    this.currentCorrectWord.en = this.roundWords[this.currentWordNumber].en;
    this.currentCorrectWord.ru = this.roundWords[this.currentWordNumber].ru;
    this.helpDefaultWords.splice(this.currentWordNumber, 1);
    this.currentWordsAnswers = [];
    this.currentWordsAnswers.push(this.currentCorrectWord.ru);
    randomNumber(0, this.helpDefaultWords.length - 1, 3).forEach((element) => {
      this.currentWordsAnswers.push(this.helpDefaultWords[element].ru);
    });
    this.currentWordsAnswers = shuffleArray(this.currentWordsAnswers);
    this.helpDefaultWords = this.roundWords.slice();
  }

  setStateCorrect(state) { // false true null
    this.roundWords[this.currentWordNumber + 1].isCorrect = state;
  }

  addRoundWords(data) {
    this.roundWords.push(
      {
        id: data.id,
        en: data.word,
        ru: data.wordTranslate,
        audio: `https://raw.githubusercontent.com/Gabriellji/rslang-data/master/${data.audio}`,
        isCorrect: null,
      },
    );
  }

  async getDefaultWords() {
    const res = await this.api.getWords(this.round, this.level);
    res.forEach((element) => {
      this.addRoundWords(element);
    });
    console.log(res);
    return res;
  }

  // async getUserWords() {
  //   const res = await this.api.getUserWords();
  //   // return null;
  //   if (res.length === 0) {
  //     return null;
  //   }
  //   res.filter((element) => element.optional.countRepetion < 4);

  //   for (const key in res) {
  //     //   if (object.hasOwnProperty(variable)) {
  //     //     statements
  //     // }
  //     const data = await this.api.getWordById(res[key].wordId);
  //     this.addRoundWords(data);
  //   }
  //   // await Promise.all(results);
  //   return res;
  // }

  getWordsForStatistics() {
    return this.roundWords.filter((element) => element.isCorrect !== null);
  }

  // getInCorrectWords() {
  //   return this.roundWords.filter((element) => element.isCorrect === false);
  // }

  // async recordStatistics() {
  //   // const res = await this.api.getUserWords();

  //   // if (!res) {

  //   // }
  // }


  // refactro setNextWOrd
}

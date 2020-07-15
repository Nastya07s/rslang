import Api from '../../../../js/api';
import shuffleArray from '../utils/shuffleArray';
import randomNumber from '../utils/randomNumber';

const MIN_NUMBER_WORDS_GAME = 5;
const MAX_NUMBER_WORDS_GAME = 20;
const MAX_NUMBER_WORDS = 3600;
/* eslint no-console: "off" */
const MODE_GAME = {
  new: 'new',
  learning: 'learning',
  old: 'old',
  mix: 'mix',
};

export default class Model {
  constructor() {
    this.audio = new Audio();
    this.audiocallStorage = '';
    this.gameMode = '';
    this.round = 0;
    this.level = 0;
    this.audioMute = false;
    this.gameActive = false;
    this.gameWords = [];
    this.gameWordsAnswers = [];
    this.currentWordsAnswers = [];
    this.currentCorrectWord = {
      en: '',
      ru: '',
    };
  }

  async init() {
    this.gameActive = false;
    this.gameWords = [];
    this.gameWordsAnswers = [];
    this.initRoundLevel();
    this.initSound();
    await this.initGameMode();
  }

  async initGame() {
    this.gameActive = true;
    this.initRoundLevel();
    await this.initGameWords();
    await this.fillGameWordsAnswers();
    this.gameWords = shuffleArray(this.gameWords);
    this.gameWordsAnswers = shuffleArray(this.gameWordsAnswers);
    this.currentWordNumber = this.gameWords.length - 1;
  }

  async initGameWords() {
    switch (this.gameMode) {
      case MODE_GAME.new:
        await this.initNewWords();
        break;
      case MODE_GAME.learning:
        await this.initLearningWords();
        break;
      case MODE_GAME.old:
        await this.initOldWords();
        break;
      case MODE_GAME.mix:
        await this.initMixWords();
        break;
      default:
        console.log('troubles .... ');
        break;
    }
  }

  async initNewWords() {
    try {
      const words = await Api.getUsersAggregatedWords({
        wordsPerPage: MAX_NUMBER_WORDS_GAME,
        filter: {
          $and: [{ userWord: null }],
        },
      });
      this.gameWords = [...words[0].paginatedResults];
    } catch (e) {
      console.log(e);
    }
  }

  async initLearningWords() {
    try {
      const words = await Api.getUsersAggregatedWords({
        wordsPerPage: MAX_NUMBER_WORDS_GAME,
        filter: {
          $and: [{ $nor: [{ userWord: null }] }, { 'userWord.optional.degreeOfKnowledge': { $lt: 5 } }],
        },
      });
      this.gameWords = [...words[0].paginatedResults];
    } catch (e) {
      console.log(e);
    }
  }

  async initOldWords() {
    try {
      const words = await Api.getUsersAggregatedWords({
        wordsPerPage: MAX_NUMBER_WORDS,
        filter: {
          $and: [{ $nor: [{ userWord: null }] },
            { 'userWord.optional.degreeOfKnowledge': { $eq: 5 } }],
        },
      });
      this.gameWords = shuffleArray([...words[0].paginatedResults]).slice(0, MAX_NUMBER_WORDS_GAME);
      console.log(this.gameWords);
    } catch (e) {
      console.log(e);
    }
  }

  async initMixWords() {
    try {
      const words = await Api.getUsersAggregatedWords({
        group: Number(this.round),
        wordsPerPage: MAX_NUMBER_WORDS_GAME,
        filter: {
          $and: [
            { page: Number(this.level) },
          ],
        },
      });
      this.gameWords = [...words[0].paginatedResults];
    } catch (e) {
      console.log(e);
    }
  }

  async fillGameWordsAnswers() {
    if (this.gameWords.length < MIN_NUMBER_WORDS_GAME) {
      const words = await Api.getUsersAggregatedWords({
        group: Number(this.round),
        wordsPerPage: MAX_NUMBER_WORDS_GAME - this.gameWords.length,
        filter: {
          $and: [{ userWord: null }],
        },
      });
      this.gameWordsAnswers = [...this.gameWords, ...[...words[0].paginatedResults]];
    } else {
      this.gameWordsAnswers = [...this.gameWords];
    }
  }

  async initGameMode() {
    try {
      const res = await Api.getSettings();
      this.gameMode = res.optional.learningMode;
    } catch (e) {
      console.log(e);
    }
  }

  initRoundLevel() {
    this.audiocallStorage = JSON.parse(localStorage.getItem('audiocall'));
    this.round = this.audiocallStorage ? this.audiocallStorage.round : this.round;
    this.level = this.audiocallStorage ? this.audiocallStorage.level : this.level;
  }

  setRound(number) {
    this.round = number;
    localStorage.setItem('audiocall',
      JSON.stringify({ round: this.round, level: this.level, audioMute: this.audioMute }));
  }

  setLevel(number) {
    this.level = number;
    localStorage.setItem('audiocall',
      JSON.stringify({ round: this.round, level: this.level, audioMute: this.audioMute }));
  }

  initSound() {
    this.audiocallStorage = JSON.parse(localStorage.getItem('audiocall'));
    this.audioMute = this.audiocallStorage ? this.audiocallStorage.audioMute : this.audioMute;
  }

  setMuteAudio() {
    this.audioMute = !this.audioMute;
    localStorage.setItem('audiocall',
      JSON.stringify({ round: this.round, level: this.level, audioMute: this.audioMute }));
  }

  setNextWord() {
    this.currentCorrectWord.en = this.gameWords[this.currentWordNumber].word;
    this.currentCorrectWord.ru = this.gameWords[this.currentWordNumber].wordTranslate;

    this.currentWordsAnswers = [];
    this.currentWordsAnswers.push(this.currentCorrectWord.ru);

    let helpGameWords = [...this.gameWordsAnswers];
    helpGameWords = helpGameWords.filter((i) => i.wordTranslate !== this.currentCorrectWord.ru);

    randomNumber(0, helpGameWords.length - 1, 4).forEach((number) => {
      this.currentWordsAnswers.push(helpGameWords[number].wordTranslate);
    });

    this.currentWordsAnswers = shuffleArray(this.currentWordsAnswers);
  }

  setStateCorrect(state) {
    this.gameWords[this.currentWordNumber + 1].isCorrect = state;
  }

  getWordsForStatistics() {
    return this.gameWords.filter((element) => element.isCorrect !== undefined);
  }


  async recordStatisticsWords() {
    const words = this.getWordsForStatistics();
    /* eslint no-underscore-dangle: "off" */
    try {
      words.forEach(async (element) => {
        if (element.userWord) {
          await this.updateUserWord(element);
        } else {
          await this.createUserWord(element);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  async updateUserWord(element) {
    const { difficulty, optional } = element.userWord;

    if (element.isCorrect && optional.degreeOfKnowledge < 5) {
      optional.degreeOfKnowledge += 1;
    }

    optional.becameLearned = optional.degreeOfKnowledge === 5 ? Date.now() : 0;
    optional.countRepetition += 1;
    optional.lastRepetition = Date.now();

    try {
      await Api.updateUserWordById(element._id, { difficulty, optional });
    } catch (e) {
      console.log(this);
    }
  }

  async createUserWord(word) {
    try {
      await Api.createUserWord(word.id || word._id, {
        difficulty: `${word.group}`,
        optional: {
          isHard: false,
          isDelete: false,
          isReadyToRepeat: false,
          countRepetition: 1,
          degreeOfKnowledge: word.isCorrect ? 1 : 0,
          lastRepetition: Date.now(),
          becameLearned: 0,
        },
      });
    } catch (e) {
      console.log(this);
    }
  }


  async recordStatisticsGame() {
    const { learnedWords, optional } = await Api.getStatistics();

    optional.audioCall.totalTimesPlayed += 1;
    optional.audioCall.lastGameResult = this
      .getWordsForStatistics()
      .filter((element) => element.isCorrect === true).length;

    optional.audioCall.lastGameDate = Date.now();

    await Api.upsertStatistics({ learnedWords, optional });
  }

  playSound(src) {
    try {
      this.audio.muted = this.audioMute;
      const url = 'https://raw.githubusercontent.com/Gabriellji/rslang-data/master';
      this.audio.src = `${url}/${src}`;
      this.audio.play();
    } catch (e) {
      //
    }
  }
}

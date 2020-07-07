import Api from '../../../../js/api';
import shuffleArray from '../utils/shuffleArray';
import randomNumber from '../utils/randomNumber';
// import { catch } from 'build/webpack.dev.conf';

const NUMBER_OF_LIVES = 5;
const MIN_NUMBER_WORDS_GAME = 4;
const MAX_NUMBER_WORDS_GAME = 20; // temporarily
const STATE_CRYSTAL = 4;
/* eslint no-console: "off" */

const MODE_GAME = {
  new: 'new',
  learning: 'learning',
  old: 'old',
  mix: 'mix',
};
// const
export default class Model {
  constructor() {
    this.api = new Api();
    this.savannahStorage = '';
    this.gameMode = '';
    this.hearts = 0;
    this.round = 0;
    this.level = 0;
    this.valueMoveBg = 0;
    this.valueUpCrystal = 0;
    this.currentStateCrystal = 1;
    this.gameWords = [];
    this.gameWordsAnswers = [];
    this.currentWordsAnswers = [];
    this.currentCorrectWord = {
      en: '',
      ru: '',
    };
  }

  async init() {
    this.hearts = NUMBER_OF_LIVES;
    this.currentStateCrystal = 1;
    this.gameWords = [];
    this.gameWordsAnswers = [];
    this.initRoundLevel();
    await this.initGameMode();
  }

  async initGame() {
    this.initRoundLevel();
    await this.initGameWords();
    await this.fillGameWordsAnswers();
    this.gameWords = shuffleArray(this.gameWords);
    this.gameWordsAnswers = shuffleArray(this.gameWordsAnswers);
    this.currentWordNumber = this.gameWords.length - 1;
    this.valueMoveBg = 100 / this.gameWords.length;// 100 => constan( need fix )
    this.valueUpCrystal = Math.floor(this.gameWords.length / STATE_CRYSTAL);
  }

  async initGameWords() {
    //
    // new - только новые слова(все из бека)
    // learning - только изучаемые слова(countRepetition < 4)
    // old - только изученные слова(countRepetition = 4)
    // mix - все три(дефолтный)
    // refactor new | old | mix  => obj

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


  // {"$nor":[{"userWord":null}]}
  //

  // если слов для раунда меньше 5, то выкидывать слова из того же раунда что и сами слова

  // во вьюшке вывести round \ level
  // выбор сложности \ уровня не отбражаю пользователю, берется из localStorage
  // раунд \ уровень увеличивается автоматически
  // получаю слова которые пользователь ещё не изучал ,
  // и получаю слова из группы и раунда для выбора ответа
  async initNewWords() {
    try {
      console.log('get new words');
      // {"$and":[{"userWord":null}]}
      const words = await
      this.api.getUsersAggregatedWords(MAX_NUMBER_WORDS_GAME, { $and: [{ userWord: null }] });
      // test = test.paginatedResults;
      this.gameWords = [...words[0].paginatedResults];
      // this.gameWordsAnswers = this.gameWords.slice();
      // console.log([...test[0].paginatedResults]);
    } catch (e) {
      console.log(e);
    }
    // return 0;
  }


  // режим должен быть не доступен в настройках если countRepetition < 4  === []
  // беру слова пользователя у которых countRepetition < 4
  async initLearningWords() {
    try {
      const words = await this.api.getUsersAggregatedWords(
        MAX_NUMBER_WORDS_GAME,
        { $and: [{ $nor: [{ userWord: null }] }, { 'userWord.optional.degreeOfKnowledge': { $lt: 5 } }] },
      );
      // test = test.paginatedResults;
      // брать первых 600, шафлить, и в this.gameWords = words.slice(0,20);
      this.gameWords = [...words[0].paginatedResults];

      // this.gameWordsAnswers = this.gameWords.slice();

      // const res = await this.api.getUsersAggregatedWords()
      // {"$and":[{"$nor":[{"userWord":null}]},
      // {"userWord.optional.countRepetition":{"$lt":4}}]} // 3600
    } catch (e) {
      console.log(e);
    }

    return 0;
  }

  // режим должен быть не доступен в настройках если countRepetition === 4 , === []
  // беру слова пользователя у которых countRepetition === 4
  async initOldWords() {
    try {
      const words = await this.api.getUsersAggregatedWords(
        MAX_NUMBER_WORDS_GAME,
        { $and: [{ $nor: [{ userWord: null }] }, { 'userWord.optional.degreeOfKnowledge': { $eq: 5 } }] },
      );
      // test = test.paginatedResults;
      this.gameWords = [...words[0].paginatedResults];

      // {"$and":[{"$nor":[{"userWord":null}]},
      // {"userWord.optional.countRepetition":{"$gte":4}}]} // 3600
    } catch (e) {
      console.log(e);
    }
    // this.gameWordsAnswers = this.gameWords.slice();

    // return 0;
  }


  // если у пользевателя отсутсвуют слова,  то я беру все слова из new( 0 ,0 ),
  // если у пользевателя есть слова, то заполняю массив поочереди learnin , old , new ...
  async initMixWords() {
    try {
      this.gameWords = await this.api.getWords(this.round, this.level);
      // this.gameWordsAnswers = this.gameWords.slice();
    } catch (e) {
      console.log(e);
    }
  }

  async fillGameWordsAnswers() {
    if (this.gameWords.length < MIN_NUMBER_WORDS_GAME) {
      const words = await this.api.getUsersAggregatedWords(
        MAX_NUMBER_WORDS_GAME - this.gameWords.length, { $and: [{ userWord: null }] },
      );
      this.gameWordsAnswers = [...this.gameWords, ...[...words[0].paginatedResults]];
    } else {
      this.gameWordsAnswers = [...this.gameWords];
    }
  }

  async initGameMode() {
    try {
      // this.gameMode = await this.api.getSettings();
      // const res = await this.api.getSettings();
      this.gameMode = 'learning';
    } catch (e) {
      console.log(e);
    }
  }

  initRoundLevel() {
    this.savannahStorage = JSON.parse(localStorage.getItem('savannah'));
    this.round = this.savannahStorage ? this.savannahStorage.round : this.round;
    this.level = this.savannahStorage ? this.savannahStorage.level : this.level; // local storage
  }

  setNextWord() {
    this.currentCorrectWord.en = this.gameWords[this.currentWordNumber].word;
    this.currentCorrectWord.ru = this.gameWords[this.currentWordNumber].wordTranslate;

    this.currentWordsAnswers = [];
    this.currentWordsAnswers.push(this.currentCorrectWord.ru);

    // const helpGameWords = this.gameWords.slice();
    // helpRoundWords.splice(this.currentWordNumber, 1);

    const helpGameWords = [...this.gameWordsAnswers];
    helpGameWords.filter((element) => element.wordTranslate !== this.currentCorrectWord.ru);


    randomNumber(0, helpGameWords.length - 1, 3).forEach((number) => {
      this.currentWordsAnswers.push(helpGameWords[number].wordTranslate);
    });

    this.currentWordsAnswers = shuffleArray(this.currentWordsAnswers);
  }

  updateCrystal() {
    if (this.valueUpCrystal === 0) {
      this.currentStateCrystal += 1;
      this.valueUpCrystal = Math.floor(this.gameWords.length / STATE_CRYSTAL);
      return true;
    }
    return false;
  }

  setRound(number) {
    this.round = number;
    localStorage.setItem('savannah', JSON.stringify({ round: this.round, level: this.level }));
  }

  setLevel(number) {
    this.level = number;
    localStorage.setItem('savannah', JSON.stringify({ round: this.round, level: this.level }));
  }

  setStateCorrect(state) {
    this.gameWords[this.currentWordNumber + 1].isCorrect = state;
  }

  getWordsForStatistics() {
    return this.gameWords.filter((element) => element.isCorrect !== undefined);
  }

  async isUserWord(id) {
    try {
      const result = await this.api.getUserWordById(id);
      return result;
    } catch (e) {
      // console.log(e);
    }
    return false;
  }

  async recordStatisticsWords() {
    const words = this.getWordsForStatistics();
    /* eslint no-underscore-dangle: "off" */
    try {
      words.forEach(async (element) => {
        const word = await this.isUserWord(element._id);
        if (word) {
          await this.updateUserWord(word, element);
        } else {
          await this.createUserWord(element);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }


  async updateUserWord(word, element) {
    const { difficulty, optional } = word;
    if (element.isCorrect && optional.degreeOfKnowledge < 5) {
      optional.degreeOfKnowledge += 1;
    }
    optional.countRepetition += 1;
    optional.lastRepetition = Date.now();
    try {
      await this.api.updateUserWordById(word.id, { difficulty, optional });
    } catch (e) {
      console.log(e);
    }
  }

  async createUserWord(word) {
    try {
      await this.api.createUserWord(word.id || word._id, {
        difficulty: `${word.group}`,
        optional: {
          isHard: false,
          isDelete: false,
          isReadyToRepeat: false,
          countRepetition: 1,
          degreeOfKnowledge: word.isCorrect ? 1 : 0,
          lastRepetition: Date.now(),
        },
      });
    } catch (e) {
      console.log(e);
    }
  }


  async recordStatisticsGame() {
    const { learnedWords, optional } = await this.api.getStatistics();
    optional.savannah.totalTimesPlayed += 1;
    optional.savannah.lastGameResult = this
      .getWordsForStatistics()
      .filter((element) => element.isCorrect === true).length;
    optional.savannah.lastGameDate = Date.now();
    await this.api.upsertStatistics({ learnedWords, optional });
  }

  // playSound(src) {
  //   if (this.mute) {
  //     return;
  //   }
  //   const audio = new Audio(src);
  //   audio.play();
  // }
}

import api from 'app/js/api';

const PAGES_COUNT = 29;
const LEVEL_COUNT = 5;
const WORDS_PER_PAGE = 20;
const DEGREE_OF_KNOWLEDGE = 5;

function shuffleArray(array) {
  return array.sort(() => 0.5 - Math.random());
}

export default class Words {
  /**
   *
   * @param config {settings, gameNameInSettings}
   */
  constructor(config) {
    this.config = config;
    this.init();
  }

  init() {
    this.api = api;
  }

  getGameSettings() {
    return this.config.settings.minigames[this.config.gameNameInSettings];
  }

  /**
   * Function is main that allows to get words from backend considering learningMode setting
   * every new call of the function returns next array (round)
   * @param shuffle - Do you want to shuffle array?
   * @returns {Promise<unknown>|Promise<*>}
   */
  getWords(shuffle = false) {
    const { learningMode } = this.config.settings;
    switch (learningMode) {
      case 'new':
        return this.getWordsNew(shuffle);
      case 'mix':
        return this.getWordsMix(shuffle);
      case 'old':
        return this.getWordsOld(shuffle);
      default:
        return this.getWordsNew(shuffle);
    }
  }

  /**
   * Increases degreeOfKnowledge and updates lastRepetition by wordId
   * @param wordId
   * @param difficulty
   * @returns {Promise<unknown>}
   */
  updateKnowledge(wordId, difficulty) {
    this.api.getUserWordById(wordId)
      .then((response) => {
        const word = response;
        word.optional = word.optional || {};
        if (word.optional.degreeOfKnowledge < DEGREE_OF_KNOWLEDGE) {
          word.optional.degreeOfKnowledge = parseInt(word.optional.degreeOfKnowledge, 10) + 1;
        } else if (!word.optional.degreeOfKnowledge) {
          word.optional.degreeOfKnowledge = 1;
        }
        return this.api.updateUserWordById(wordId, {
          difficulty: word.difficulty,
          optional: word.optional,
        });
      }, () => {
        this.api.createUserWord(wordId, {
          difficulty,
          optional: {
            degreeOfKnowledge: 1,
            countRepetition: 0,
            lastRepetition: Date.now(),
          },
        });
      });
  }

  updateRepetition(wordId, difficulty) {
    this.api.getUserWordById(wordId)
      .then((response) => {
        const word = response;
        word.optional = word.optional || {};
        if (word.optional.countRepetition) {
          word.optional.countRepetition += 1;
        } else {
          word.optional.countRepetition = 1;
        }
        word.optional.lastRepetition = Date.now();
        return this.api.updateUserWordById(wordId, {
          difficulty: word.difficulty,
          optional: word.optional,
        });
      }, () => {
        this.api.createUserWord(wordId, {
          difficulty,
          optional: {
            degreeOfKnowledge: 0,
            countRepetition: 1,
            lastRepetition: Date.now(),
          },
        });
      });
  }

  /**
   * Allows return to settings (getWords returns words by group and page from settings)
   */
  resetToSettings() {
    this.group = undefined;
    this.page = undefined;
  }

  async getWordsNew(shuffle = false) {
    if (this.group !== undefined && this.page !== undefined) {
      this.page += 1;
      if (this.page > PAGES_COUNT) {
        this.group += 1;
        this.page = 0;
        if (this.group > LEVEL_COUNT) {
          this.group = LEVEL_COUNT;
        }
      }
    } else {
      const settings = this.getGameSettings();
      const group = settings ? settings.difficulty || 0 : 0;
      const page = settings ? settings.round || 0 : 0;
      this.group = parseInt(group, 10);
      this.page = parseInt(page, 10);
    }
    const words = await this.api.getWords(this.group, this.page);
    if (shuffle) {
      return shuffleArray(words);
    }
    return words;
  }

  async getWordsOld(shuffle = false) {
    if (!this.userWords) {
      this.userWords = await this.api.getUserWords();
    }
    if (this.userWords && this.userWords.length !== 0) {
      let wordsToGet;
      if (this.userWords.length > WORDS_PER_PAGE) {
        wordsToGet = this.userWords.slice(0, WORDS_PER_PAGE - 1);
        this.userWords = this.userWords.slice(WORDS_PER_PAGE);
      } else {
        wordsToGet = Array.from(this.userWords);
        this.userWords.length = 0;
      }
      const promises = wordsToGet.map((element) => this.api.getWordById(element.wordId));
      const responseUserWords = await Promise.all(promises);
      const wordsFiltered = [];
      wordsToGet.forEach((element, index) => {
        if (element.optional && element.optional.degreeOfKnowledge < DEGREE_OF_KNOWLEDGE) {
          wordsFiltered.push(responseUserWords[index]);
        }
      });
      if (shuffle) {
        return shuffleArray(wordsFiltered);
      }
      return wordsFiltered;
    }
    return this.getWordsNew();
  }

  async getWordsMix(shuffle = false) {
    const words = (await this.getWordsNew()).concat((await this.getWordsOld()));
    if (shuffle) {
      return shuffleArray(words);
    }
    return words;
  }

  async getUserWords() {
    const degreeOfKnowledges = [0, 1, 2, 3, 5];
    const filter = {
      $or: degreeOfKnowledges.map((element) => ({ 'userWord.optional.degreeOfKnowledge': element })),
    };
    return this.api.getUsersAggregatedWords('', WORDS_PER_PAGE, true, filter);
  }
}

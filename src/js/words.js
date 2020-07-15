import api from 'app/js/api';

const PAGES_COUNT = 29;
const LEVEL_COUNT = 5;
const WORDS_PER_PAGE = 20;
const DEGREE_OF_KNOWLEDGE_MAX = 5;
const DEGREE_OF_KNOWLEDGE_LEARNING = [0, 1, 2, 3, 4, null];

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
      case 'learning':
        return this.getWordsByDegreeOfKnowledge(DEGREE_OF_KNOWLEDGE_LEARNING, shuffle);
      case 'old':
        return this.getWordsByDegreeOfKnowledge([DEGREE_OF_KNOWLEDGE_MAX], shuffle);
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
  async updateKnowledge(wordId, difficulty) {
    const response = await this.api.getUsersAggregatedWordsById(wordId);
    if (!response || !response[0]) {
      return;
    }
    const word = response[0].userWord;
    if (!word) {
      const newWord = Words.getNewWord(difficulty);
      newWord.optional.countRepetition = 1;
      this.api.createUserWord(wordId, newWord);
    } else {
      word.optional = word.optional || {};
      if (word.optional.degreeOfKnowledge < DEGREE_OF_KNOWLEDGE_MAX) {
        word.optional.degreeOfKnowledge = parseInt(word.optional.degreeOfKnowledge, 10) + 1;
        if (word.optional.degreeOfKnowledge === DEGREE_OF_KNOWLEDGE_MAX) {
          word.optional.becameLearned = Date.now();
        }
      } else if (!word.optional.degreeOfKnowledge) {
        word.optional.degreeOfKnowledge = 1;
      }
      this.api.updateUserWordById(wordId, {
        difficulty: word.difficulty,
        optional: word.optional,
      });
    }
  }

  async updateRepetition(wordId, difficulty) {
    const response = await this.api.getUsersAggregatedWordsById(wordId);
    if (!response || !response[0]) {
      return;
    }
    const word = response[0].userWord;
    if (!word) {
      const newWord = Words.getNewWord(difficulty);
      newWord.optional.countRepetition = 1;
      this.api.createUserWord(wordId, newWord);
    } else {
      word.optional = word.optional || {};
      if (word.optional.countRepetition) {
        word.optional.countRepetition += 1;
      } else {
        word.optional.countRepetition = 1;
      }
      word.optional.lastRepetition = Date.now();
      this.api.updateUserWordById(wordId, {
        difficulty: word.difficulty,
        optional: word.optional,
      });
    }
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
    let words = await this.api.getUsersAggregatedWords({
      filter: {
        $and: [
          { userWord: null },
        ],
      },
      wordsPerPage: 20,
    });
    words = Words.mapPaginatedResults(words);
    if (shuffle) {
      return shuffleArray(words);
    }
    return words;
  }

  async getWordsByDegreeOfKnowledge(degreeOfKnowledgeArray, shuffle = false) {
    if (!this.userWords) {
      const userWordsResponse = await this.getUserWords(degreeOfKnowledgeArray);
      this.userWords = Words.mapPaginatedResults(userWordsResponse);
    }
    if (this.userWords && this.userWords.length !== 0) {
      let responseWords;
      if (this.userWords.length > WORDS_PER_PAGE) {
        responseWords = this.userWords.slice(0, WORDS_PER_PAGE);
        this.userWords = this.userWords.slice(WORDS_PER_PAGE);
      } else {
        responseWords = Array.from(this.userWords);
        this.userWords.length = 0;
      }
      if (shuffle) {
        return shuffleArray(responseWords);
      }
      return responseWords;
    }
    return this.getWordsNew();
  }

  async getWordsMix(shuffle = false) {
    const words = (await this.getWordsNew())
      .concat(
        await this.getWordsByDegreeOfKnowledge(
          DEGREE_OF_KNOWLEDGE_LEARNING.concat([DEGREE_OF_KNOWLEDGE_MAX]),
        ),
      );
    if (shuffle) {
      return shuffleArray(words);
    }
    return words;
  }

  async getUserWords(degreeOfKnowledgeArray) {
    const filter = {
      $and: [
        { userWord: { $ne: null } },
        { $or: degreeOfKnowledgeArray.map((element) => ({ 'userWord.optional.degreeOfKnowledge': element })) },
      ],
    };
    return this.api.getUsersAggregatedWords({ filter, wordsPerPage: 5000 });
  }

  static getNewWord(difficulty) {
    return {
      difficulty: String(difficulty),
      optional: {
        countRepetition: 0,
        isDelete: false,
        isHard: false,
        isReadyToRepeat: false,
        lastRepetition: Date.now(),
        degreeOfKnowledge: 0,
        becameLearned: 0,
      },
    };
  }

  static mapPaginatedResults(response) {
    if (!response || !response[0] || !response[0].paginatedResults) {
      return null;
    }
    const result = response[0].paginatedResults;
    const id = '_id';
    return result.map((element) => {
      const newElement = { ...element };
      newElement.id = newElement[id];
      newElement.wordId = newElement[id];
      return newElement;
    });
  }
}

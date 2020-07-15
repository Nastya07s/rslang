import performRequests from 'app/js/utils/perform-requests';
import api from 'app/js/api';

class Settings {
  constructor() {
    this.minigames = {
      speakit: {
        isMute: undefined, // false
        round: undefined, // 0
        difficulty: undefined, // 0
      },
      englishPuzzle: {
        isMute: undefined, // false
        round: undefined, // 0
        difficulty: undefined, // 0
      },
      savannah: {
        isMute: undefined, // false
        round: undefined, // 0
        difficulty: undefined, // 0
      },
      audioCall: {
        isMute: undefined, // false
        round: undefined, // 0
        difficulty: undefined, // 0
      },
      sprint: {
        isMute: undefined, // false
        round: undefined, // 0
        difficulty: undefined, // 0
      },
      fillword: {
        isMute: undefined, // false
        round: undefined, // 0
        difficulty: undefined, // 0
      },
    };
    this.isGlobalMute = undefined; // false
    this.wordsPerDay = undefined; // 20
    this.learningMode = undefined; // new|old|mix
    this.countNewWords = undefined; // 10
    this.definitionSentence = undefined; // false
    this.exampleSentence = undefined; // false
    this.translateWord = undefined; // false
    this.associationImage = undefined; // false
    this.transcription = undefined; // false
    this.answerButton = undefined; // false
    this.deleteButton = undefined; // false
    this.hardWordsButton = undefined; // false
  }

  /**
   * Set default data & send it to the remote server.
   * Internal method which is used by getSettings().
   */
  async initSettings() {
    this.setSettings();
    await this.postUpdates();
  }

  async getSettings() {
    const settings = await performRequests([api.getSettings.bind(api)]);

    if (!settings) {
      // Set default settings & synchronise with the remote server
      this.initSettings();
    } else {
      // Set the settings retrieved from the remote server
      this.setSettings(...settings); // Promise.all returns array of resolved/rejected promises
    }
  }

  /**
   * Parses the given settings & sets their fields with data into instance of class.
   * @param {Object} settings stores settings usually from backend
   */
  setSettings(settings = {}) {
    console.log(settings);
    const {
      wordsPerDay = 20,
      optional: {
        minigames = {
          speakit: {
            isMute: false,
            round: 0,
            difficulty: 0,
          },
          englishPuzzle: {
            isMute: false,
            round: 0,
            difficulty: 0,
          },
          savannah: {
            isMute: false,
            round: 0,
            difficulty: 0,
          },
          audioCall: {
            isMute: false,
            round: 0,
            difficulty: 0,
          },
          sprint: {
            isMute: false,
            round: 0,
            difficulty: 0,
          },
          fillword: {
            isMute: false,
            round: 0,
            difficulty: 0,
          },
        },
        isGlobalMute = false,
        learningMode = 'mix',
        countNewWords = 10,
        definitionSentence = false,
        exampleSentence = false,
        translateWord = false,
        associationImage = false,
        transcription = false,
        answerButton = false,
        deleteButton = false,
        hardWordsButton = false,
      } = {},
    } = settings;

    this.wordsPerDay = wordsPerDay;
    this.minigames = minigames;
    this.isGlobalMute = isGlobalMute;
    this.learningMode = learningMode;
    this.countNewWords = countNewWords;
    this.definitionSentence = definitionSentence;
    this.exampleSentence = exampleSentence;
    this.translateWord = translateWord;
    this.associationImage = associationImage;
    this.transcription = transcription;
    this.answerButton = answerButton;
    this.deleteButton = deleteButton;
    this.hardWordsButton = hardWordsButton;
  }

  /**
   * Update local instance of class & send these update to the server.
   * @param {String} key name of the field which must be updated @see localUpdates()
   * @param {*} value what must be set
   */
  async update(key, value) {
    this.localUpdates(key, value);
    await this.postUpdates();
  }

  localUpdates(key, value) {
    switch (key) {
      case 'speakit':
      case 'englishPuzzle':
      case 'savannah':
      case 'audioCall':
      case 'sprint':
      case 'fillword':
        this.minigames[key] = value;
        break;
      default:
        this[key] = value;
        break;
    }
  }

  /**
   * Synchronizes settings with backend API.
   */
  async postUpdates() {
    const {
      wordsPerDay,
      minigames,
      isGlobalMute,
      learningMode,
      countNewWords,
      definitionSentence,
      exampleSentence,
      translateWord,
      associationImage,
      transcription,
      answerButton,
      deleteButton,
      hardWordsButton,
    } = this;

    const settings = {
      wordsPerDay,
      optional: {
        minigames,
        isGlobalMute,
        learningMode,
        countNewWords,
        definitionSentence,
        exampleSentence,
        translateWord,
        associationImage,
        transcription,
        answerButton,
        deleteButton,
        hardWordsButton,
      },
    };

    const response = await performRequests([api.upsertSettings.bind(api, settings)]);

    if (response) {
      // Promise.all returns array of resolved/rejected promises
      console.log('Ответ: ', ...response);
    }
  }
}

const settings = new Settings();

export default settings;

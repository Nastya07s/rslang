import performRequests from 'app/js/utils/perform-requests';
import Api from 'app/js/api';

class Settings {
  constructor() {
    this.api = new Api();

    this.minigames = {
      speakit: {},
      englishPuzzle: {},
      savannah: {},
      audioCall: {},
      sprint: {},
      ourGame: {},
    };
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
    this.addToHardWordsButton = undefined; // false
  }

  /**
   * Use this if you need to initialize settings for new user.
   */
  async initSettings() {
    this.setSettings();
    await this.postUpdates();
  }

  async getSettings() {
    const settings = await performRequests([this.api.getSettings()]);

    if (settings) {
      this.setSettings(...settings);
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
        minigames = {},
        learningMode = 'mix',
        countNewWords = 10,
        definitionSentence = false,
        exampleSentence = false,
        translateWord = false,
        associationImage = false,
        transcription = false,
        answerButton = false,
        deleteButton = false,
        addToHardWordsButton = false,
      } = {},
    } = settings;

    this.wordsPerDay = wordsPerDay;
    this.minigames = minigames;
    this.learningMode = learningMode;
    this.countNewWords = countNewWords;
    this.definitionSentence = definitionSentence;
    this.exampleSentence = exampleSentence;
    this.translateWord = translateWord;
    this.associationImage = associationImage;
    this.transcription = transcription;
    this.answerButton = answerButton;
    this.deleteButton = deleteButton;
    this.addToHardWordsButton = addToHardWordsButton;
  }

  /**
   * Update local instance of class & send these update to the server.
   * @param {String} key name of the field which must be updated @see localUpdates()
   * @param {*} value what must be set
   */
  update(key, value) {
    this.localUpdates(key, value);
    this.postUpdates();
  }

  localUpdates(key, value) {
    switch (key) {
      case 'speakit':
      case 'englishPuzzle':
      case 'savannah':
      case 'audioCall':
      case 'sprint':
      case 'ourGame':
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
      learningMode,
      countNewWords,
      definitionSentence,
      exampleSentence,
      translateWord,
      associationImage,
      transcription,
      answerButton,
      deleteButton,
      addToHardWordsButton,
    } = this;

    const settings = {
      wordsPerDay,
      optional: {
        minigames,
        learningMode,
        countNewWords,
        definitionSentence,
        exampleSentence,
        translateWord,
        associationImage,
        transcription,
        answerButton,
        deleteButton,
        addToHardWordsButton,
      },
    };

    const response = await performRequests([this.api.upsertSettings(settings)]);

    if (response) {
      console.log('Ответ: ', ...response);
    }
  }
}

export default Settings;

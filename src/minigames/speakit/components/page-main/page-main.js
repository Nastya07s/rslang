import performRequests from 'app/js/utils/perform-requests';
import api from 'app/js/api';
import settings from 'app/js/settings';
import utils from 'app/js/utils/utils';
import loader from 'app/js/utils/loader';
import wordsHelper from 'speakit/helpers/words';
import ProgressBar from '../progress-bar/progress-bar';
import PopUp from '../pop-up/pop-up';

class PageMain {
  constructor(props = {}) {
    this.elements = {};
    this.classes = {
      ROOT: 'page-main',
      WORDS_CONTAINER: 'words-container',
      WORD_CARD: 'words-container__card',
      WORD_CARD_HIDDEN: 'words-container__card_hidden',
      WORD_CARD_ACTIVE: 'words-container__card_active',
      WORD_CARD_CORRECT: 'words-container__card_answer_correct',
      WORD_CARD_WRONG: 'words-container__card_answer_wrong',
      AUDIO_PLAYER: 'audio-player',
      IMAGE: 'current-word-container__image',
      TRANSLATION: 'current-word-container__translation',
      TRANSLATION_HIDDEN: 'current-word-container__translation_hidden',
      WORD: 'words-container__word',
      SKIP_BUTTON: 'controls__skip-button',
      SPEAK_BUTTON: 'controls__speak-button',
      BUTTON_DISABLED: 'controls__button_disabled',
      SCORE: 'score__total',
      CONTROLS_CLOSE_BUTTON: 'controls-container__close-button',
    };

    this.eventBus = props.eventBus;
    this.difficulty = props.difficulty;
    this.round = props.round;
    this.volume = props.volume;
    this.progressBar = null;
    this.data = null;
    this.baseUrl = 'https://raw.githubusercontent.com/kamikozz/rslang-data/master/';
    this.speechRecognition = null;
    this.score = null;
    this.scoreStreak = 0;
    this.isMixMode = this.difficulty !== -1;
    this.currentCardIndex = 0;
    this.isGameEnded = false;
    this.answers = {
      validAnswers: [],
      invalidAnswers: [],
    };
  }

  async init() {
    loader.toggle();

    this.initArguments(); // process the arguments (e.g. prevent index out of bounds)
    await this.initData(); // get data for cards

    // To prevent loading without data (navigator.onLine is not true)
    if (!this.data) {
      loader.toggle();
      return this.eventBus.emit('pageMain.error');
    }

    this.render(); // render main page (get markup)
    this.initElements(); // find elements by their classnames
    await this.initHandlers(); // add event listeners to the initialized elements

    this.progressBar = new ProgressBar({
      min: 0,
      max: this.data.length,
    });

    await this.createCard(); // create first card (render & init)

    loader.toggle();

    return this.eventBus.emit('pageMain.ready');
  }

  /**
   * Processing & initializing or resetting the arguments of the class.
   */
  initArguments() {
    if (this.isMixMode) {
      const isDifficultyOutOfBound = this.difficulty > 5 || this.difficulty < 0;

      if (isDifficultyOutOfBound) {
        this.difficulty = 0;
      }
    }

    // Set or reset the score
    this.score = 0;
    this.scoreStreak = 0;
    this.isGameEnded = false;
  }

  async initData() {
    const LEARNING_MODES = {
      NEW: 'new',
      LEARNING: 'learning',
      OLD: 'old',
      MIX: 'mix',
    };
    let filter;

    switch (settings.learningMode) {
      case LEARNING_MODES.NEW: {
        filter = {
          $and: [
            { userWord: null },
          ],
        };
        break;
      }
      case LEARNING_MODES.LEARNING: {
        filter = {
          $and: [{
            $nor: [
              { userWord: null },
            ],
          }, {
            'userWord.optional.degreeOfKnowledge': {
              $lt: 5,
            },
          }],
        };
        break;
      }
      case LEARNING_MODES.OLD: {
        filter = {
          $and: [{
            $nor: [
              { userWord: null },
            ],
          }, {
            'userWord.optional.degreeOfKnowledge': {
              $eq: 5,
            },
          }],
        };
        break;
      }
      default: {
        filter = {
          $and: [
            { page: this.round },
          ],
        };
        break;
      }
    }

    const params = {
      wordsPerPage: 20,
      filter,
    };

    if (this.isMixMode) {
      params.group = this.difficulty;
    }

    this.data = await performRequests([api.getUsersAggregatedWords.bind(api, params)]);

    if (this.data) {
      const processData = () => {
        const { data: [responseResults] } = this;
        const [results] = responseResults;
        const { paginatedResults } = results;

        return paginatedResults;
      };

      this.data = processData();

      const isEnoughData = this.data.length > 0;

      if (isEnoughData) {
        console.log(this.data);

        this.data = utils.shuffleFisherYates(this.data);
      } else {
        this.data = null;

        const popUp = new PopUp({
          element: document.body,
          title: 'Недостаточно слов для игры',
          description: 'Переключитесь на другой режим (например, "смешанный") на странице главного приложения или добавьте больше слов на изучение, или дождитесь периода интервального обучения',
          handlerExitButton: () => {
            document.location.href = '/main';
          },
          handlerCancelButton: () => {},
          type: 'info',
        });

        popUp.toggle();
      }
    }
  }

  render() {
    const fragment = new DocumentFragment();
    const template = document.createElement('template');

    template.innerHTML = `
      <div
        class="page-main animation-float-background"
        style="background-image: url(/assets/img/speakit/bg-wave.jpg)">
        <header class="page-intro__controls-block page-main__header-controls-block">
          <div class="wrapper">
            <ul class="controls-container page-main__header-controls-container">
              <li class="controls-container__group">
                <button
                  class="controls-container__button controls-container__close-button"
                  title="Закрыть игру">
                  <img
                    class="icon icon__close icon_inverted"
                    src="/assets/img/minigames-start-page/close.svg"
                    alt="Close icon"/>
                </button>
              </li>
            </ul>
          </div>
        </header>
        <main class="page-main__main">
          <div class="wrapper">
            <div class="page-main__score score">
              <p class="score__title page-main_theme_border">Счёт</p>
              <div class="score__total">
                ${this.score}
              </div>
              <div class="progress-bar">
                <div class="progress-bar__current-value page-main_theme_border"></div>
                <progress class="progress-bar__progress" value="" max=""></progress>
                <div class="progress-bar__max-value page-main_theme_border"></div>
              </div>
            </div>
            <div class="page-main__current-word-container current-word-container">
              <div class="current-word-container__image-container">
                <img class="current-word-container__image" alt="your word's image">
              </div>
              <p class="current-word-container__translation">Ваше произношение или перевод появится здесь 😁</p>
            </div>
            <div class="page-main__words-container words-container">
            </div>
            <div class="page-main__controls controls">
              <button class="controls__button controls__skip-button">Не знаю 😢</button>
              <button class="controls__button controls__speak-button">Speak it</button>
            </div>
            <audio class="audio-player" preload="none" src=""></audio>
          </div>
        </main>
      </div>
    `;

    const root = template.content.firstElementChild;

    fragment.append(template.content);
    document.body.append(fragment);

    this.elements = {
      ...this.elements,
      root,
    };
  }

  async createCard(index = 0) {
    // Create Markup
    this.renderCard(index);

    // Init Handlers
    const { wordsContainer } = this.elements;
    const card = wordsContainer.firstElementChild;

    card.addEventListener('click', this.handlerCardClick.bind(this));

    const cardData = this.data[index];

    wordsHelper.updateRepetition(cardData); // change countRepetition & lastRepetition fields
    await this.changeImage(card); // set image and await image's load event

    const { WORD_CARD_HIDDEN } = this.classes;

    card.classList.remove(WORD_CARD_HIDDEN);

    const { translation } = this.elements;
    const { TRANSLATION_HIDDEN } = this.classes;

    translation.classList.remove(TRANSLATION_HIDDEN);

    this.changeTranslation(card); // change text
  }

  renderCard(index = 0) {
    const { wordsContainer } = this.elements;

    // To prevent loading without data (navigator.onLine is not true)
    if (!this.data) {
      return;
    }

    const {
      word,
      transcription,
      image,
      audio,
      wordTranslate,
    } = this.data[index];
    const cardTemplate = document.createElement('template');

    cardTemplate.innerHTML = `
      <div class="words-container__card words-container__card_hidden" data-audio="${audio}" data-image="${image}" data-translation="${wordTranslate}">
        <span class="words-container__icon"></span>
        <div class="words-container__word-container">
          <p class="words-container__word">${word}</p>
          <p class="words-container__transcription">${transcription}</p>
        </div>
      </div>
    `;
    wordsContainer.append(cardTemplate.content);
  }

  initElements() {
    const { root } = this.elements;
    const {
      WORDS_CONTAINER,
      SKIP_BUTTON,
      SPEAK_BUTTON,
      AUDIO_PLAYER,
      IMAGE,
      TRANSLATION,
      SCORE,
      CONTROLS_CLOSE_BUTTON,
    } = this.classes;
    const [wordsContainer] = root.getElementsByClassName(WORDS_CONTAINER);
    const [skipButton] = root.getElementsByClassName(SKIP_BUTTON);
    const [speakButton] = root.getElementsByClassName(SPEAK_BUTTON);
    const [audioPlayer] = root.getElementsByClassName(AUDIO_PLAYER);
    const [gallery] = root.getElementsByClassName(IMAGE);
    const [translation] = root.getElementsByClassName(TRANSLATION);
    const [score] = root.getElementsByClassName(SCORE);
    const [closeButton] = root.getElementsByClassName(CONTROLS_CLOSE_BUTTON);

    this.elements = {
      ...this.elements,
      wordsContainer,
      skipButton,
      speakButton,
      audioPlayer,
      gallery,
      translation,
      score,
      closeButton,
    };
  }

  async initHandlers() {
    const {
      root,
      skipButton,
      speakButton,
      audioPlayer,
      closeButton,
    } = this.elements;

    // Get image from root's style background-image.
    // Remove url() & return this by using RegExp's group matcher.
    const backgroundImageSrc = root.style.backgroundImage.match(/^url\("(.*)"\)$/)[1];

    await utils.loadImage(backgroundImageSrc); // Load image using async/await

    // set default volume
    audioPlayer.volume = this.volume;

    skipButton.addEventListener('click', this.skipCard.bind(this));
    speakButton.addEventListener('click', this.handlerSpeakButton.bind(this));
    closeButton.addEventListener('click', () => {
      const popUp = new PopUp({
        element: document.body,
        title: 'Тренировка не закончена',
        description: 'Если вы вернётесь в главное приложение, Ваши результаты не будут сохранены!',
        handlerExitButton: () => {
          document.location.href = '/main';
        },
        handlerCancelButton: () => {},
        type: 'pop-up',
      });

      popUp.toggle();
    });
  }

  handlerRestartButton() {
    if (this.speechRecognition) {
      const {
        score,
        skipButton,
        speakButton,
      } = this.elements;

      this.stopSpeechRecognition();

      // Reset score
      this.initArguments();
      // Make visual changes
      score.textContent = this.score;

      // Reset buttons to the default state
      skipButton.classList.remove(this.classes.BUTTON_DISABLED);
      speakButton.classList.remove(this.classes.BUTTON_DISABLED);
    }
  }

  handlerSpeakButton() {
    const {
      speakButton,
    } = this.elements;

    speakButton.textContent = !this.speechRecognition ? 'Стоп' : 'Speak it';

    if (!this.speechRecognition) {
      this.startSpeechRecognition();
    } else {
      this.stopSpeechRecognition();
    }
  }

  startSpeechRecognition() {
    if (this.speechRecognition) {
      this.stopSpeechRecognition();
    }

    const WebkitSpeechRecognition = window.SpeechRecognition
      || window.webkitSpeechRecognition
      || window.mozSpeechRecognition
      || window.msSpeechRecognition;

    this.speechRecognition = new WebkitSpeechRecognition();
    this.speechRecognition.lang = 'en-US';
    this.speechRecognition.maxAlternatives = 10;
    this.speechRecognition.addEventListener('result', this.recognize.bind(this));
    this.speechRecognition.addEventListener('end', this.speechRecognition.start);
    this.speechRecognition.start();
  }

  stopSpeechRecognition() {
    // Stop Speech Recognition
    if (this.speechRecognition) {
      this.speechRecognition.abort();
      this.speechRecognition.removeEventListener('end', this.speechRecognition.start);
      this.speechRecognition = null;
    }
  }

  async recognize(event) {
    // Get raw translations
    const [translationAlternatives] = [...event.results];
    // Make translation case insensitive
    let translations = [...translationAlternatives].map((item) => item.transcript.toLowerCase());

    // Get words array from sentences & make Strings[] -> Array(Strings[], Strings[])
    translations = translations.map((translation) => translation.split(' '));
    // Make Array(Strings[]) -> Strings[]
    translations = translations.flat();
    // Remove duplicated words & return Array
    translations = Array.from(new Set(translations));

    await this.checkRecognizedWord(translations);
  }

  async checkRecognizedWord(translations) {
    const { wordsContainer } = this.elements;
    const {
      WORD,
      WORD_CARD_CORRECT,
      WORD_CARD_WRONG,
    } = this.classes;

    const card = wordsContainer.firstElementChild;

    const [word] = card.getElementsByClassName(WORD);
    // Check if is correct / wrong
    const cardWordText = word.textContent.toLowerCase();
    // Find card word text by the given recognized text to check if it's correct / wrong
    const isCorrect = Boolean(translations.find((translation) => cardWordText === translation));

    const { translation } = this.elements;
    const cardData = this.data[this.currentCardIndex];

    if (isCorrect) {
      // 1. Change text of the translation block
      translation.textContent = word.textContent;
      // 2. Change image of the card
      await this.changeImage(card);
      // 3. Check for if card is not colored (if it's not answered)
      // to increase the score if it's correct
      const isChecked = card.classList.contains(WORD_CARD_CORRECT)
        || card.classList.contains(WORD_CARD_CORRECT);

      if (!isChecked) {
        this.increaseScore();
      }

      // Store data for future statistics
      this.answers.validAnswers.push(cardData);

      // Change degreeOfKnowledge field
      wordsHelper.updateKnowledge(cardData);

      // Mark as correct
      card.classList.toggle(WORD_CARD_CORRECT);
    } else {
      [translation.textContent] = translations; // get first recognition & set translation
      this.scoreStreak = 0;

      // Store data for future statistics
      this.answers.invalidAnswers.push(cardData);

      // Mark as wrong
      card.classList.toggle(WORD_CARD_WRONG);
    }

    // Change Card
    this.changeCard(card);
  }

  async handlerCardClick(event) {
    const { WORD_CARD, WORD_CARD_ACTIVE } = this.classes;

    let { target } = event;

    while (target && !target.classList.contains(WORD_CARD)) {
      target = target.parentElement;
    }

    const card = target;

    if (card) {
      card.classList.add(WORD_CARD_ACTIVE);
    }

    this.playSound(card);
    await this.changeImage(card);
    this.changeTranslation(card);
  }

  /**
   * Set audio src to the audioPlayer to play the given card's pronunciation.
   * @param {HTMLElement} card card with the given word
   */
  playSound(card) {
    const { audioPlayer } = this.elements;
    const audioSrc = `${this.baseUrl}${card.dataset.audio}`;
    const isCardAudioSourceChanged = audioPlayer.src !== audioSrc;

    if (isCardAudioSourceChanged) {
      audioPlayer.src = audioSrc;
    }

    try {
      audioPlayer.play();
    } catch (e) {
      // DOMException: The play() request was interrupted by a new load request. https://goo.gl/LdLk22
    }
  }

  /**
   * Change main image with the clicked card's image.
   * @param {HTMLElement} card card with the given word
   */
  async changeImage(card) {
    const { gallery } = this.elements;
    const imageSrc = `${this.baseUrl}${card.dataset.image}`;
    const isCardImageSourceChanged = gallery.src !== imageSrc;

    if (isCardImageSourceChanged) {
      const func = () => new Promise((resolve, reject) => {
        gallery.src = imageSrc;

        gallery.onload = (data) => {
          resolve(data);
          gallery.onload = null;
        };
        gallery.onerror = (error) => {
          reject(error);
          gallery.onerror = null;
        };
      });

      let response = await performRequests([func.bind(this)]);

      if (response) {
        [response] = response;
      }
    }
  }

  changeTranslation(card) {
    const { translation } = this.elements;
    const { dataset: { translation: dataTranslation } } = card;
    const isCardTranslationChanged = translation.textContent !== dataTranslation;

    if (isCardTranslationChanged) {
      translation.textContent = dataTranslation;
    }
  }

  increaseScore() {
    const { score } = this.elements;
    // each forth correct word in a row will give a user bonus score
    const isStreak = this.scoreStreak > 2;

    this.scoreStreak += 1; // increase score streak

    const BONUS_COEFFICIENT = 1.5;

    this.score = isStreak ? Math.ceil(this.score * BONUS_COEFFICIENT) : this.score + 1;

    score.textContent = this.score; // make visual changes
  }

  async changeCard(cardElement) {
    const { skipButton } = this.elements;
    const { BUTTON_DISABLED } = this.classes;

    skipButton.classList.add(BUTTON_DISABLED);
    skipButton.disabled = true;

    const card = cardElement;
    const isCardReadyToBeChanged = new Promise((resolve) => {
      card.ontransitionend = () => resolve();
    });
    const { WORD_CARD_HIDDEN } = this.classes;

    card.classList.add(WORD_CARD_HIDDEN); // trigger transitionend event

    const { translation } = this.elements;
    const { TRANSLATION_HIDDEN } = this.classes;

    translation.classList.add(TRANSLATION_HIDDEN);

    await isCardReadyToBeChanged; // wait until transition ends

    card.remove();
    this.currentCardIndex += 1;
    this.progressBar.changeProgressBy(1);

    const isIndexInBounds = this.currentCardIndex < this.data.length;

    if (isIndexInBounds) {
      await this.createCard(this.currentCardIndex);

      skipButton.classList.remove(BUTTON_DISABLED);
      skipButton.disabled = false;
    } else {
      this.gameEnded();
    }
  }

  skipCard() {
    const { skipButton } = this.elements;
    const { BUTTON_DISABLED } = this.classes;

    skipButton.classList.add(BUTTON_DISABLED);
    skipButton.disabled = true;

    if (this.isGameEnded) {
      return;
    }

    const { wordsContainer } = this.elements;
    const card = wordsContainer.firstElementChild;

    // If the game is already ended or if some error has happened
    if (!card) {
      return;
    }

    this.scoreStreak = 0;

    const cardData = this.data[this.currentCardIndex];
    // Store data for future statistics
    this.answers.invalidAnswers.push(cardData);

    // Mark as wrong
    const { WORD_CARD_WRONG } = this.classes;

    card.classList.add(WORD_CARD_WRONG);

    this.changeCard(card);
  }

  async gameEnded() {
    this.eventBus.emit('statistics.update', this.score);
    // 4.2. Show modal of the end of the game with results
    const paramsPageOutroInit = this.initStatistics();

    this.eventBus.emit('pageOutro.init', paramsPageOutroInit);

    this.isGameEnded = !this.isGameEnded;

    const { skipButton, speakButton } = this.elements;
    const { BUTTON_DISABLED } = this.classes;

    skipButton.classList.add(BUTTON_DISABLED);

    this.stopSpeechRecognition();

    speakButton.textContent = 'Speak it';
    speakButton.classList.add(BUTTON_DISABLED);
  }

  initStatistics() {
    let callback = async () => {
      // Need to increase round or difficulty and set rounds :D
      let { difficulty, round } = this;

      if (this.isMixMode) {
        const isRoundCorrect = round !== wordsHelper.MAX_ROUND;

        if (isRoundCorrect) {
          round += 1;
        } else {
          round = 0;

          const isDifficultyCorrect = difficulty !== wordsHelper.MAX_DIFFICULTY;

          difficulty = isDifficultyCorrect ? difficulty + 1 : 0;
        }
      }

      // Synchronize the data with Settings & remote server
      const { minigames: { speakit } } = settings;

      speakit.difficulty = difficulty;
      speakit.round = round;

      await this.eventBus.emit('settings.update', 'speakit', speakit);

      return {
        volume: this.volume,
        isMixMode: this.isMixMode,
      };
    };

    callback = callback.bind(this);

    return {
      words: this.answers,
      volume: this.volume,
      callback,
    };
  }
}

export default PageMain;

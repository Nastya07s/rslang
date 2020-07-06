import performRequests from 'app/js/utils/perform-requests';
import api from 'app/js/api';
// import loader from 'app/js/utils/loader';

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
      WORD: 'words-container__word',
      SKIP_BUTTON: 'controls__skip-button',
      SPEAK_BUTTON: 'controls__speak-button',
      RESTART_BUTTON: 'controls__restart-button',
      BUTTON_DISABLED: 'controls__button_disabled',
      SCORE: 'score__total',
    };

    this.eventBus = props.eventBus;
    this.difficulty = props.difficulty;
    this.round = props.round;
    this.volume = props.volume;
    this.data = null;
    this.baseUrl = 'https://raw.githubusercontent.com/kamikozz/rslang-data/master/';
    this.speechRecognition = null;
    this.score = null;
    this.scoreStreak = 0;
    this.isDefaultMode = this.difficulty !== -1;
    this.currentCardIndex = 0;
  }

  async init() {
    // loader.toggle();
    this.initArguments(); // process the arguments (e.g. prevent index out of bounds)
    await this.initData(); // get data for cards

    // To prevent loading without data (navigator.onLine is not true)
    if (!this.data) {
      return this.eventBus.emit('pageMain.error');
    }

    this.render(); // render main page (get markup)
    this.initElements(); // find elements by their classnames
    this.initHandlers(); // add event listeners to the initialized elements
    await this.createCard(); // create first card (render & init)
    // loader.toggle();
    return this.eventBus.emit('pageMain.ready');
  }

  /**
   * Processing & initializing or resetting the arguments of the class.
   */
  initArguments() {
    if (this.isDefaultMode) {
      const isDifficultyOutOfBound = this.difficulty > 5 || this.difficulty < 0;

      if (isDifficultyOutOfBound) {
        this.difficulty = 0;
      }
    }

    // Set or reset the score
    this.score = 0;
    this.scoreStreak = 0;
  }

  async initData() {
    if (this.isDefaultMode) {
      this.data = await performRequests([api.getWords.bind(api, this.round, this.difficulty)]);

      if (this.data) {
        [this.data] = this.data;
      }
    } else {
      // TODO: логика на работу с другим режимом!
      this.data = await api.getWords(0, 0);
    }
  }

  render() {
    const fragment = new DocumentFragment();
    const template = document.createElement('template');

    template.innerHTML = `
      <div class="page-main" style="background-image: url(/assets/img/speakit/bg-intro.svg)">
        <main class="page-main__main">
          <div class="wrapper">
            <div class="page-main__score score">
              <p class="score__title">Счёт:</p>
              <div class="score__total">
                ${this.score}
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
              <button class="controls__button controls__restart-button controls__button_disabled">Заново</button>
              <button class="controls__button controls__speak-button">Speak it</button>
              <button class="controls__button controls__results-button">Результаты</button>
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

    // Set translation
    this.changeTranslation(card);
    // Set image and await image's load event
    await this.changeImage(card);
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
      <div class="words-container__card" data-audio="${audio}" data-image="${image}" data-translation="${wordTranslate}">
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
      RESTART_BUTTON,
      SPEAK_BUTTON,
      AUDIO_PLAYER,
      IMAGE,
      TRANSLATION,
      SCORE,
    } = this.classes;
    const [wordsContainer] = root.getElementsByClassName(WORDS_CONTAINER);
    const [skipButton] = root.getElementsByClassName(SKIP_BUTTON);
    const [restartButton] = root.getElementsByClassName(RESTART_BUTTON);
    const [speakButton] = root.getElementsByClassName(SPEAK_BUTTON);
    const [audioPlayer] = root.getElementsByClassName(AUDIO_PLAYER);
    const [gallery] = root.getElementsByClassName(IMAGE);
    const [translation] = root.getElementsByClassName(TRANSLATION);
    const [score] = root.getElementsByClassName(SCORE);

    this.elements = {
      ...this.elements,
      wordsContainer,
      skipButton,
      restartButton,
      speakButton,
      audioPlayer,
      gallery,
      translation,
      score,
    };
  }

  initHandlers() {
    const {
      skipButton,
      restartButton,
      speakButton,
      audioPlayer,
    } = this.elements;

    // set default volume
    audioPlayer.volume = this.volume;

    skipButton.addEventListener('click', this.skipCard.bind(this));
    restartButton.addEventListener('click', this.handlerRestartButton.bind(this));
    speakButton.addEventListener('click', this.handlerSpeakButton.bind(this));
  }

  handlerRestartButton() {
    if (this.speechRecognition) {
      const {
        score,
        restartButton,
        speakButton,
      } = this.elements;

      // Stop Speech Recognition
      this.speechRecognition.abort();
      this.speechRecognition.removeEventListener('end', this.speechRecognition.start);

      // Reset score
      this.initArguments();
      // Make visual changes
      score.textContent = this.score;

      // Reset buttons to the default state
      restartButton.classList.add(this.classes.BUTTON_DISABLED);
      speakButton.classList.remove(this.classes.BUTTON_DISABLED);
    }
  }

  handlerSpeakButton() {
    const SpeechRecognition = window.webkitSpeechRecognition;

    this.speechRecognition = new SpeechRecognition();
    this.speechRecognition.lang = 'en-US';
    this.speechRecognition.maxAlternatives = 10;
    this.speechRecognition.addEventListener('result', this.recognize.bind(this));
    this.speechRecognition.addEventListener('end', this.speechRecognition.start);
    this.speechRecognition.start();

    const {
      restartButton,
      speakButton,
    } = this.elements;
    const { BUTTON_DISABLED } = this.classes;

    restartButton.classList.remove(BUTTON_DISABLED);
    speakButton.classList.add(BUTTON_DISABLED);
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

    console.log('SOURCE', translations);

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

      // Mark as correct
      card.classList.toggle(WORD_CARD_CORRECT);
    } else {
      [translation.textContent] = translations; // get first recognition & set translation
      this.scoreStreak = 0;
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
    this.score += isStreak ? this.score : 1; // multiply by 2 or by 1

    score.textContent = this.score; // make visual changes
  }

  changeCard(cardElement) {
    const card = cardElement;

    const {
      WORD_CARD_HIDDEN,
    } = this.classes;

    card.classList.add(WORD_CARD_HIDDEN);
    card.ontransitionend = async () => {
      // 1. Remove previous card
      card.remove();

      // 2. Increase index by 1
      this.currentCardIndex += 1;
      // 3. Check if next card exists
      const isIndexInBounds = this.currentCardIndex < this.data.length;

      if (isIndexInBounds) {
        // 4.1. Create new card
        await this.createCard(this.currentCardIndex);
      } else {
        // 4.2. TODO: Show modal of the end of the game with results!
        console.log(this.score);
        this.handlerRestartButton();
      }
    };
  }

  skipCard() {
    const { wordsContainer } = this.elements;
    const card = wordsContainer.firstElementChild;

    // If the game is already ended or if some error has happened
    if (!card) {
      return;
    }

    this.scoreStreak = 0;

    // Mark as wrong
    const { WORD_CARD_WRONG } = this.classes;

    card.classList.add(WORD_CARD_WRONG);

    this.changeCard(card);
  }
}

export default PageMain;

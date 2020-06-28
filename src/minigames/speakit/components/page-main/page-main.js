// import loader from '../../js/loader';

const getTranslation = async (word) => {
  const baseUrl = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=';
  const key = 'trnsl.1.1.20200427T065631Z.0c10983194239a87.e571e7bd7d82365b43142a166f902ab5f37ea1dd';
  const params = `&text=${word}&lang=en-ru`;
  const url = `${baseUrl}${key}${params}`;
  const res = await fetch(url);
  const json = await res.json();

  return json;
};

class PageMain {
  constructor(props = {}) {
    this.classes = {
      ROOT: 'page-main',
      SPEAK_BUTTON: 'controls__speak-button',
      WORDS_CONTAINER: 'words-container',
      WORD_CARD: 'words-container__card',
      WORD_CARD_ACTIVE: 'words-container__card_active',
      AUDIO_PLAYER: 'audio-player',
      IMAGE: 'current-word-container__image',
      TRANSLATION: 'current-word-container__translation',
      WORD: 'words-container__word',
      PAGINATION: 'pagination__list',
      DIFFICULTY: 'pagination__item',
      ACTIVE_DIFFICULTY: 'pagination__item_active',
      RESTART_BUTTON: 'controls__restart-button',
      BUTTON_DISABLED: 'controls__button_disabled',
      SCORE: 'score__total',
    };
    this.elements = {};
    this.difficulty = props.difficulty;
    this.round = props.round;
    this.api = props.api;
    this.data = null;
    this.baseUrl = 'https://raw.githubusercontent.com/kamikozz/rslang-data/master/data/';
    this.speechRecognition = null;
    this.score = null;
    this.isDefaultMode = this.difficulty !== -1;
  }

  async init() {
    this.initArguments();

    await this.initData();
    this.render();
    this.initElements();
    this.initHandlers();
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
  }

  async initData() {
    if (this.isDefaultMode) {
      this.data = await this.api.getWords(this.round, this.difficulty);
    } else {
      // TODO: логика на работу с другим режимом!
      this.data = await this.api.getWords(0, 0);
    }

    this.data = await this.data.map((item) => {
      const processedItem = item;

      processedItem.audio = processedItem.audio.replace('files/', '');
      processedItem.image = processedItem.image.replace('files/', '');
      return processedItem;
    });

    // loader.toggleLoader();
  }

  render() {
    const fragment = new DocumentFragment();
    const template = document.createElement('template');

    template.innerHTML = `
      <div class="page-main" style="background-image: url(/assets/img/speakit/bg-intro.svg)">
        <main class="page-main__main">
          <div class="wrapper">
            <div class="page-main__pagination pagination">
              <ul class="pagination__list">
                <li class="pagination__item">Very Easy</li>
                <li class="pagination__item">Easy</li>
                <li class="pagination__item">Normal</li>
                <li class="pagination__item">Hard</li>
                <li class="pagination__item">Very hard</li>
                <li class="pagination__item">You truly speak english!</li>
              </ul>
            </div>
            <div class="page-main__score score">
              <p class="score__title">Счёт:</p>
              <div class="score__total">
                ${this.score}
              </div>
            </div>
            <div class="page-main__current-word-container current-word-container">
              <div class="current-word-container__image-container">
                <img class="current-word-container__image" src="/assets/img/speakit/bg-intro.jpg" alt="your word">
              </div>
              <p class="current-word-container__translation">Ваше произношение или перевод появится здесь 😁</p>
            </div>
            <div class="page-main__words-container words-container">
            </div>
            <div class="page-main__controls controls">
              <button class="controls__button controls__restart-button controls__button_disabled">Заново</button>
              <button class="controls__button controls__speak-button">Speak it</button>
              <button class="controls__button controls__results-button controls__button_disabled">Результаты</button>
            </div>
            <audio class="audio-player" preload="none" src=""></audio>
          </div>
        </main>
      </div>
    `;

    const root = template.content.firstElementChild;

    const {
      PAGINATION,
      WORDS_CONTAINER,
      ACTIVE_DIFFICULTY,
    } = this.classes;
    const [pagination] = root.getElementsByClassName(PAGINATION);
    const [wordsContainer] = root.getElementsByClassName(WORDS_CONTAINER);

    // FIXME: перенести подсвечивание сложностей в другую страницу
    if (this.isDefaultMode) {
      pagination.children[this.difficulty].classList.add(ACTIVE_DIFFICULTY);
    }

    this.data.forEach((item) => {
      const {
        word, transcription, image, audio,
      } = item;
      const cardTemplate = document.createElement('template');

      cardTemplate.innerHTML = `
        <div class="words-container__card" data-audio="${audio}" data-image="${image}">
          <span class="words-container__icon"></span>
          <div class="words-container__word-container">
            <p class="words-container__word">${word}</p>
            <p class="words-container__transcription">${transcription}</p>
          </div>
        </div>
      `;
      wordsContainer.append(cardTemplate.content);
    });
    fragment.append(template.content);
    document.body.append(fragment);

    this.elements = {
      ...this.elements,
      root,
      pagination,
      wordsContainer,
    };
  }

  initElements() {
    const { root } = this.elements;
    const {
      RESTART_BUTTON,
      SPEAK_BUTTON,
      AUDIO_PLAYER,
      IMAGE,
      TRANSLATION,
      SCORE,
    } = this.classes;
    const [restartButton] = root.getElementsByClassName(RESTART_BUTTON);
    const [speakButton] = root.getElementsByClassName(SPEAK_BUTTON);
    const [audioPlayer] = root.getElementsByClassName(AUDIO_PLAYER);
    const [gallery] = root.getElementsByClassName(IMAGE);
    const [translation] = root.getElementsByClassName(TRANSLATION);
    const [score] = root.getElementsByClassName(SCORE);

    this.elements = {
      ...this.elements,
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
      restartButton,
      speakButton,
      wordsContainer,
      pagination,
      audioPlayer,
    } = this.elements;

    // set default volume
    audioPlayer.volume = 0.2;

    restartButton.addEventListener('click', this.handlerRestartButton.bind(this));
    speakButton.addEventListener('click', this.handlerSpeakButton.bind(this));
    wordsContainer.children.forEach((card) => {
      card.addEventListener('click', this.handlerCardClick.bind(this));
    });
    pagination.addEventListener('click', this.handlerSwitchDifficulty.bind(this));
  }

  handlerSwitchDifficulty(event) {
    const {
      DIFFICULTY,
      ACTIVE_DIFFICULTY,
    } = this.classes;
    const {
      root,
      pagination,
    } = this.elements;
    const { target } = event;
    const hasDifficultyClassName = target.classList.contains(DIFFICULTY);
    const isActiveDifficulty = target.classList.contains(ACTIVE_DIFFICULTY);

    if (event.target && hasDifficultyClassName && !isActiveDifficulty) {
      const chosenDifficulty = Array.prototype.findIndex.call(pagination.children,
        (item) => event.target === item);

      this.handlerRestartButton(); // remove added handlers to speech recognition
      root.remove(); // remove the whole page

      // loader.toggleLoader(); // place loader gif

      const mainPage = new PageMain({
        api: this.api,
        difficulty: chosenDifficulty,
        round: 0,
      });

      mainPage.init();
    }
  }

  handlerRestartButton() {
    if (this.speechRecognition) {
      const {
        score,
        wordsContainer,
        restartButton,
        speakButton,
      } = this.elements;

      this.speechRecognition.abort();
      this.speechRecognition.removeEventListener('end', this.speechRecognition.start);
      this.score = 0;
      score.textContent = this.score;

      [...wordsContainer.children].forEach((card) => {
        card.removeAttribute('style');
      });

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

  recognize(event) {
    const [translationAlternatives] = [...event.results];
    const translations = [...translationAlternatives].map((item) => item.transcript.toLowerCase());

    console.log('SOURCE', translations);

    this.checkRecognizedWord(translations);
  }

  checkRecognizedWord(translations) {
    const { wordsContainer } = this.elements;
    const { WORD } = this.classes;

    const searchCard = [...wordsContainer.children].find((card) => {
      let [cardWordText] = card.getElementsByClassName(WORD);

      cardWordText = cardWordText.textContent.toLowerCase();

      return translations.find((translation) => cardWordText === translation);
    });

    const { translation } = this.elements;

    if (searchCard) {
      const [word] = searchCard.getElementsByClassName(WORD);
      const wordText = word.textContent;

      translation.textContent = wordText;
      this.changeImage(searchCard);

      const searchCardStyle = searchCard.getAttribute('style');
      const isEmpty = searchCardStyle === null || searchCardStyle === '';

      if (isEmpty) {
        this.increaseScore();
      }

      searchCard.style.pointerEvents = 'none';
      searchCard.style.backgroundColor = '#90ee90';
    } else {
      [translation.textContent] = translations; // get first recognition
    }
  }

  handlerCardClick(event) {
    const { wordsContainer } = this.elements;
    const { WORD_CARD, WORD_CARD_ACTIVE } = this.classes;

    let { target } = event;

    while (target && !target.classList.contains(WORD_CARD)) {
      target = target.parentElement;
    }

    if (target) {
      wordsContainer.children.forEach((wordCard) => {
        wordCard.classList.remove(WORD_CARD_ACTIVE);
      });
      target.classList.add(WORD_CARD_ACTIVE);
    }

    this.playSound(target);
    this.changeImage(target);
    this.translateWord(target);
  }

  /**
   * Set audio src to the audioPlayer to play the given card's pronunciation.
   * @param {HTMLElement} card card with the given word
   */
  playSound(card) {
    const { audioPlayer } = this.elements;
    const audioSrc = card.dataset.audio;

    audioPlayer.src = `${this.baseUrl}${audioSrc}`;

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
  changeImage(card) {
    const { gallery } = this.elements;
    const imageSrc = card.dataset.image;

    gallery.src = `${this.baseUrl}${imageSrc}`;
  }

  async translateWord(card) {
    const { WORD } = this.classes;
    const [word] = card.getElementsByClassName(WORD);

    const response = await getTranslation(word.textContent);
    let translation = '';
    const isSuccess = response.code === 200;

    if (isSuccess) {
      [translation] = response.text;
    }

    const { translation: translationEl } = this.elements;

    translationEl.textContent = translation;
  }

  increaseScore() {
    const { score } = this.elements;

    this.score += 1;
    score.textContent = this.score;
  }
}

export default PageMain;

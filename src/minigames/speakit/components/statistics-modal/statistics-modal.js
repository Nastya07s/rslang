class StatisticsModal {
  /**
   * @param {Object} props parameters {
   *      parent, // HTMLElement in which will be rendered this component
   *      data, // { validAnswers: Array[], invalidAnswers: Array[] } Object contains 2 Arrays with
   *  `correct` & `invalid` answers
   *      volume, // [0..1]
   *    }
   */
  constructor(props) {
    this.elements = {
      parent: props.element,
    };
    this.classes = {
      RESTART_TRAINING: 'restart-training',
      FINISH_TRAINING: 'finish-training',
      FINISH_STATISTICS_HIDDEN: 'finish-statistics_hidden',
      ANIMATION_POP_UP: 'animation-pop-up',
      ANIMATION_POP_DOWN: 'animation-pop-down',
      ANSWERS: 'finish-statistics__answer-audio',
    };
    this.handlerStartButton = props.handlerStartButton;
    this.handlerCloseButton = props.handlerCloseButton;
    this.data = props.data;
    this.volume = props.volume;
    this.isHidden = true;
    this.audioPlayer = null;
  }

  init() {
    this.render(); // Render markup
    this.initElements(); // Find HTML elements by their classNames
    this.initHandlers(); // Add event listeners on the initialized stateful elements
    this.initAudioPlayer();
  }

  render() {
    const fragment = new DocumentFragment();
    const template = document.createElement('template');

    const renderAnswers = (answers) => {
      const elements = [];

      answers.forEach(({ audio, word, wordTranslate }) => {
        elements.push(`
          <div class="finish-statistics__answer" data-audio="${audio}">
            <div class="finish-statistics__answer-audio"></div>
            <div class="finish-statistics__answer-eng">${word}</div>
            <div class="finish-statistics__answer-dash">—</div>
            <div class="finish-statistics__answer-ru">${wordTranslate}</div>
          </div>
        `);
      });

      return elements.join('\n');
    };

    const renderResultTitle = (wrongAnswers) => {
      let ret;
      const RESULTS = {
        NO_MISTAKES: 'Превосходный результат!',
        MISTAKES: 'Неплохо, но есть над чем поработать!',
      };
      const isNoMistakes = wrongAnswers === 0;

      if (isNoMistakes) {
        ret = RESULTS.NO_MISTAKES;
      } else {
        ret = RESULTS.MISTAKES;
      }

      return ret;
    };
    const { validAnswers, invalidAnswers } = this.data;

    template.innerHTML = `
      <div class="statistics">
        <div class="finish-statistics finish-statistics_hidden">
          <div class="finish-statistics__title">${renderResultTitle(invalidAnswers.length)}</div>
          <div class="wrapper__answers">
            <div class="finish-statistics__answers">
              <div class="finish-statistics__answers-invalid-title">ОШИБОК: ${invalidAnswers.length}</div>
              <div class="finish-statistics__answers-invalid">${renderAnswers(invalidAnswers)}</div>
              <div class="finish-statistics__answers-line"></div>
              <div class="finish-statistics__answers-valid-title">ЗНАЮ: ${validAnswers.length}</div>
              <div class="finish-statistics__answers-valid">${renderAnswers(validAnswers)}</div>
            </div>
          </div>
          <div class="finish-statistics__controls-container">
            <button class="finish-statistics__controls-button restart-training">Продолжить тренировку</button>
            <button class="finish-statistics__controls-button finish-training">На главную</button>
          </div>
        </div>
      </div>
    `;

    const root = template.content.firstElementChild;

    this.elements = {
      ...this.elements,
      root,
    };

    fragment.append(template.content);
    this.elements.parent.append(fragment);
  }

  initElements() {
    const { root } = this.elements;
    const {
      RESTART_TRAINING,
      FINISH_TRAINING,
      ANSWERS,
    } = this.classes;
    const [restartTrainingButton] = root.getElementsByClassName(RESTART_TRAINING);
    const [finishTrainingButton] = root.getElementsByClassName(FINISH_TRAINING);
    const answers = root.getElementsByClassName(ANSWERS);

    this.elements = {
      ...this.elements,
      restartTrainingButton,
      finishTrainingButton,
      answers,
    };
  }

  initHandlers() {
    const {
      restartTrainingButton,
      finishTrainingButton,
      answers,
    } = this.elements;

    // Control Buttons Handlers
    restartTrainingButton.addEventListener('click', () => {
      console.log('Начать заново');
      restartTrainingButton.disabled = true;
      this.handlerStartButton();
    });

    finishTrainingButton.addEventListener('click', () => {
      finishTrainingButton.disabled = true;
      this.handlerCloseButton();
    });

    // Answers to play a sound
    answers.forEach((audioIcon) => {
      const cardBlock = audioIcon.parentElement;

      audioIcon.addEventListener('click', () => {
        this.playSound(cardBlock);
      });
    });
  }

  initAudioPlayer() {
    this.audioPlayer = new Audio();
    this.audioPlayer.volume = this.volume;
  }

  changeVolume(volume) {
    this.audioPlayer.volume = volume;
  }

  /**
   * Set audio src to the audioPlayer to play the given card's pronunciation.
   * @param {HTMLElement} card card with the given word
   */
  playSound(card) {
    const baseUrl = 'https://raw.githubusercontent.com/kamikozz/rslang-data/master/';
    const audioSrc = `${baseUrl}${card.dataset.audio}`;
    const isCardAudioSourceChanged = this.audioPlayer.src !== audioSrc;

    if (isCardAudioSourceChanged) {
      this.audioPlayer.src = audioSrc;
    }

    try {
      this.audioPlayer.play();
    } catch (e) {
      // DOMException: The play() request was interrupted by a new load request. https://goo.gl/LdLk22
    }
  }

  toggle() {
    const { root } = this.elements;
    const {
      ANIMATION_POP_UP,
      ANIMATION_POP_DOWN,
      FINISH_STATISTICS_HIDDEN,
    } = this.classes;

    const modal = root.firstElementChild;

    if (this.isHidden) {
      modal.classList.add(ANIMATION_POP_UP);
      modal.classList.remove(ANIMATION_POP_DOWN);
      modal.classList.remove(FINISH_STATISTICS_HIDDEN);
    } else {
      modal.classList.remove(ANIMATION_POP_UP);
      modal.classList.add(ANIMATION_POP_DOWN);
      modal.classList.add(FINISH_STATISTICS_HIDDEN);
    }

    this.isHidden = !this.isHidden;
  }
}

export default StatisticsModal;

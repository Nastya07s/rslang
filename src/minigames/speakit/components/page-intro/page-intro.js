import utils from 'app/js/utils/utils';
import settings from 'app/js/settings';

class PageIntro {
  constructor(props) {
    this.elements = {};
    this.classes = {
      PAGE_INTRO_HIDDEN: 'page-intro_hidden',
      VISUALLY_HIDDEN: 'visually-hidden',
      START_BUTTON: 'page-intro__start-button',
      CONTROLS_AUDIO_BUTTON: 'controls-container__audio-button',
      CONTROLS_SETTINGS_BUTTON: 'controls-container__settings-button',
      CONTROLS_CLOSE_BUTTON: 'controls-container__close-button',
      PAGE_INTRO_PAGINATION: 'page-intro__pagination',
      PAGINATION: 'pagination__list',
      DIFFICULTY: 'pagination__item',
      ACTIVE_DIFFICULTY: 'pagination__item_active',
    };

    this.eventBus = props.eventBus;
    this.isMixMode = settings.learningMode === 'mix';
  }

  async init() {
    this.render(); // Render markup
    this.initElements(); // Find HTML elements by their classNames
    this.restoreState(); // Restore state of the elements
    await this.initHandlers(); // Add event listeners on the initialized stateful elements
  }

  render() {
    const fragment = new DocumentFragment();
    const template = document.createElement('template');

    // Control Buttons Logic (unset/set settings button)
    const renderSettings = () => {
      // If 'mix' mode is set -> unset settingsButton
      const ret = this.isMixMode
        ? `<div class="tooltip settings">
            <button
              class="controls-container__button controls-container__settings-button"
              title="Настройки">
              <img
                class="icon icon__settings"
                src="/assets/img/minigames-start-page/settings.svg"
                alt="Settings icon"/>
            </button>
            <div class="tooltip-content-left tooltip-content_hidden settings__container">
            </div>
          </div>`
        : '';

      return ret;
    };

    template.innerHTML = `
      <div class="page-intro animation-change-colors visually-hidden" style="background-image: url(/assets/img/speakit/bg-intro.svg)">
        <header class="page-intro__controls-block">
          <div class="wrapper">
            <ul class="controls-container">
              <li class="controls-container__group">
                <button class="controls-container__audio-button"></button>
              </li>
              <li class="controls-container__group">
                ${renderSettings()}
                <button class="controls-container__close-button">CLOSE</button>
              </li>
            </ul>
          </div>
        </header>
        <main class="page-intro__main">
          <div class="wrapper">
            <div class="page-intro__text-container">
              <h1 class="page-intro__app-name">SpeakIt</h1>
              <h2 class="page-intro__app-description">Приложение, в котором вы можете прослушать произношение слов английского языка и проверить правильно ли вы произносите эти слова</h2>
              <p class="page-intro__app-how-to-use"><b class="page-intro__first-word">Нажмите</b> на кнопку и произносите слова на экране.</p>
              <p class="page-intro__app-how-to-use"><b class="page-intro__first-word">Нажмите</b> на слово, чтобы услышать произношение.</p>
              <p class="page-intro__app-how-to-use"><b class="page-intro__first-word">Нажмите</b> на кнопку ниже, чтобы начать игру.</p>
              <button class="page-intro__start-button animation-change-colors">Начать</button>
            </div>
          </div>
        </main>
      </div>
    `;

    const root = template.content.firstElementChild;

    this.elements = {
      ...this.elements,
      root,
    };

    fragment.append(template.content);
    document.body.append(fragment);
  }

  initElements() {
    const { root } = this.elements;
    const {
      CONTROLS_AUDIO_BUTTON,
      CONTROLS_CLOSE_BUTTON,
      START_BUTTON,
    } = this.classes;
    const [audioButton] = root.getElementsByClassName(CONTROLS_AUDIO_BUTTON);
    const [closeButton] = root.getElementsByClassName(CONTROLS_CLOSE_BUTTON);
    const [startButton] = root.getElementsByClassName(START_BUTTON);

    // If '!mix' mode is set -> unset settingsButton
    if (this.isMixMode) {
      const {
        CONTROLS_SETTINGS_BUTTON,
        PAGE_INTRO_PAGINATION,
        PAGINATION,
      } = this.classes;
      const [settingsButton] = root.getElementsByClassName(CONTROLS_SETTINGS_BUTTON);
      const [pageIntroPagination] = root.getElementsByClassName(PAGE_INTRO_PAGINATION);
      const [pagination] = root.getElementsByClassName(PAGINATION);

      this.elements = {
        ...this.elements,
        settingsButton,
        pageIntroPagination,
        pagination,
      };
    }

    this.elements = {
      ...this.elements,
      audioButton,
      closeButton,
      startButton,
    };
  }

  async initHandlers() {
    const {
      root,
      audioButton,
      closeButton,
      settingsButton,
      startButton,
    } = this.elements;

    // Intro Page Handlers
    root.addEventListener('transitionend', (e) => {
      const { target } = e;
      const isRoot = target === root;

      if (!isRoot) {
        return;
      }

      root.remove();
    });

    // Get image from root's style background-image.
    // Remove url() & return this by using RegExp's group matcher.
    const backgroundImageSrc = root.style.backgroundImage.match(/^url\("(.*)"\)$/)[1];

    await utils.loadImage(backgroundImageSrc); // Load image using async/await

    // Control Buttons Handlers
    // Audio handler
    audioButton.addEventListener('click', async () => {
      const { minigames: { speakit } } = settings;

      speakit.isMute = !speakit.isMute;

      audioButton.textContent = speakit.isMute ? 'MUTED' : 'NOT MUTED';

      await this.eventBus.emit('settings.update', 'speakit', speakit);
    });

    // If '!mix' mode is set -> unset settingsButton
    if (settingsButton) {
      settingsButton.addEventListener('click', () => {
        const { pageIntroPagination } = this.elements;

        // show/hide pop-up with settings
        pageIntroPagination.parentElement.classList.toggle('tooltip-content_hidden');
      });

      const { pagination } = this.elements;

      pagination.addEventListener('click', async (event) => {
        await this.handlerSwitchDifficulty(event);
      });
    }

    closeButton.addEventListener('click', () => {
      window.location.href = '/';
    });

    // Start Button Handlers
    startButton.addEventListener('click', async () => {
      // Create new PageMain & init the game
      await this.eventBus.emit('pageIntro.startGame', { isMixMode: this.isMixMode });
    });
  }

  restoreState() {
    const {
      minigames: {
        speakit,
      },
    } = settings;

    // Restore mute/unmute button state
    const { audioButton } = this.elements;

    audioButton.textContent = speakit.isMute ? 'MUTED' : 'NOT MUTED';

    // Restore pagination state
    const { ACTIVE_DIFFICULTY } = this.classes;
    const { pagination } = this.elements;

    pagination.children[speakit.difficulty].classList.add(ACTIVE_DIFFICULTY);
  }

  hide() {
    const { root } = this.elements;
    const { PAGE_INTRO_HIDDEN } = this.classes;

    root.classList.toggle(PAGE_INTRO_HIDDEN);
  }

  show() {
    const { root } = this.elements;
    const { VISUALLY_HIDDEN } = this.classes;

    root.classList.toggle(VISUALLY_HIDDEN);
  }

  async handlerSwitchDifficulty(event) {
    const { DIFFICULTY, ACTIVE_DIFFICULTY } = this.classes;
    const { pagination } = this.elements;
    const { target } = event;
    const hasDifficultyClassName = target.classList.contains(DIFFICULTY);
    const isActiveDifficulty = target.classList.contains(ACTIVE_DIFFICULTY);

    if (event.target && hasDifficultyClassName && !isActiveDifficulty) {
      // Find chosen difficulty
      const chosenDifficulty = Array.prototype.findIndex.call(pagination.children,
        (item) => event.target === item);

      const { minigames: { speakit } } = settings;

      // Remove previous active difficulty class
      pagination.children[speakit.difficulty].classList.remove(ACTIVE_DIFFICULTY);
      // Add new active difficulty class
      pagination.children[chosenDifficulty].classList.add(ACTIVE_DIFFICULTY);

      // Update difficulty on the backend
      speakit.difficulty = chosenDifficulty;

      await this.eventBus.emit('settings.update', 'speakit', speakit);
    }
  }
}

export default PageIntro;

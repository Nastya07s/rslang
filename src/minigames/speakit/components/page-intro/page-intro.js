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
      PAGE_INTRO_SELECT: 'page-intro__select',
    };

    this.eventBus = props.eventBus;
    this.isMixMode = settings.learningMode === 'mix';
  }

  async init() {
    this.render(); // Render markup
    this.initElements(); // Find HTML elements by their classNames
    await this.loadElements(); // Triggers all onload events & awaits them for load
    this.restoreState(); // Restore state of the elements
    await this.initHandlers(); // Add event listeners on the initialized stateful elements
  }

  render() {
    const fragment = new DocumentFragment();
    const template = document.createElement('template');

    // Control Buttons Logic (unset/set settings button)
    const renderSettings = () => {
      const renderPagination = () => {
        const paginationString = new Array(6)
          .fill(0)
          .map(() => `
            <li class="pagination__item settings__difficulty-star">
              <object class="icon icon__star" data="/assets/img/minigames-start-page/star.svg">
              </object>
            </li>
          `)
          .join('\n');

        const ret = `
          <div class="page-intro__pagination pagination">
            <p class="settings__title">Сложность</p>
            <ul class="pagination__list">
              ${paginationString}
            </ul>
          </div>
        `;

        return ret;
      };

      const renderSelectOption = () => {
        const optionsString = new Array(30)
          .fill(0)
          .map((item, index) => `<option value="${index}">${index + 1}</option>`)
          .join('\n');

        const ret = `
          <div class="delete-me-select-options">
            <p class="settings__title">Раунд (1 - 30)</p>
            <select class="page-intro__select">
              ${optionsString}
            </select>
          </div>
        `;

        return ret;
      };

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
              ${renderPagination()}
              ${renderSelectOption()}
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
                <button
                  class="controls-container__button controls-container__audio-button"
                  title="Включить/выключить звук">
                  <img
                    class="icon icon__speaker icon_hidden"
                    src="/assets/img/minigames-start-page/speaker.svg"
                    alt="Speaker icon"/>
                  <img
                    class="icon icon__speaker-muted"
                    src="/assets/img/minigames-start-page/speaker_muted.svg"
                    alt="Disabled speaker icon"/>
                </button>
              </li>
              <li class="controls-container__group">
                ${renderSettings()}
                <button
                  class="controls-container__button controls-container__close-button"
                  title="Закрыть игру">
                  <img
                    class="icon icon__close"
                    src="/assets/img/minigames-start-page/close.svg"
                    alt="Close icon"/>
                </button>
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
        PAGE_INTRO_SELECT,
      } = this.classes;
      const [settingsButton] = root.getElementsByClassName(CONTROLS_SETTINGS_BUTTON);
      const [pageIntroPagination] = root.getElementsByClassName(PAGE_INTRO_PAGINATION);
      const [pagination] = root.getElementsByClassName(PAGINATION);
      const [pageIntroSelect] = root.getElementsByClassName(PAGE_INTRO_SELECT);

      this.elements = {
        ...this.elements,
        settingsButton,
        pageIntroPagination,
        pagination,
        pageIntroSelect,
      };
    }

    this.elements = {
      ...this.elements,
      audioButton,
      closeButton,
      startButton,
    };
  }

  loadElements() {
    const { pagination } = this.elements;
    const difficulties = Array.from(pagination.children);
    const objectElements = difficulties.map((item) => item.firstElementChild);
    const promises = utils.loadElements(objectElements);

    return Promise.all(promises);
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

      this.setAudioIcon(speakit.isMute);

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

      const { pageIntroSelect } = this.elements;

      pageIntroSelect.addEventListener('change', async (event) => {
        const { target: { value } } = event;
        const { minigames: { speakit } } = settings;

        // Update round on the backend
        // Select option returns value in String
        speakit.round = Number(value);

        await this.eventBus.emit('settings.update', 'speakit', speakit);
      });
    }

    closeButton.addEventListener('click', () => {
      window.location.href = '/main';
    });

    // Start Button Handlers
    startButton.addEventListener('click', async () => {
      startButton.disabled = true;
      // Create new PageMain & init the game
      await this.eventBus.emit('pageIntro.startGame', { isMixMode: this.isMixMode });
    });
  }

  setAudioIcon(isMute) {
    const { audioButton } = this.elements;

    const ICON_HIDDEN = 'icon_hidden';
    const SEARCH_CLASSNAME = isMute ? 'icon__speaker-muted' : 'icon__speaker';

    audioButton.children.forEach((element) => {
      const hasSearchClassName = element.classList.contains(SEARCH_CLASSNAME);

      if (hasSearchClassName) {
        element.classList.remove(ICON_HIDDEN);
      } else {
        element.classList.add(ICON_HIDDEN);
      }
    });
  }

  restoreState() {
    const {
      minigames: {
        speakit,
      },
    } = settings;

    // Restore mute/unmute button state
    this.setAudioIcon(speakit.isMute);

    // Restore pagination state
    const { pagination } = this.elements;

    if (pagination) {
      const difficulties = Array.from(pagination.children);

      this.fillDifficulties(difficulties, speakit.difficulty);
    }

    // Restore select option state
    const { pageIntroSelect } = this.elements;

    if (pageIntroSelect) {
      pageIntroSelect.value = speakit.round;
    }
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
    const { DIFFICULTY } = this.classes;
    const { target } = event; // <ul> or <li>
    const hasDifficultyClassName = target.classList.contains(DIFFICULTY); // prevent miss clicks

    if (!hasDifficultyClassName) {
      return;
    }

    const { pagination } = this.elements; // <ul>

    const difficulties = Array.from(pagination.children);
    const chosenDifficultyIndex = difficulties.findIndex((difficulty) => target === difficulty);

    const { minigames: { speakit } } = settings;

    const isChanged = speakit.difficulty !== chosenDifficultyIndex;

    if (isChanged) {
      this.fillDifficulties(difficulties, chosenDifficultyIndex);

      // Update difficulty on the backend
      speakit.difficulty = chosenDifficultyIndex;

      await this.eventBus.emit('settings.update', 'speakit', speakit);
    }
  }

  fillDifficulties(array, endIndex) {
    const { ACTIVE_DIFFICULTY } = this.classes;

    array.forEach((difficulty, index) => {
      const svg = utils.getSvgElement(difficulty);

      const isFillActive = index <= endIndex;

      if (isFillActive) {
        difficulty.classList.add(ACTIVE_DIFFICULTY);
        svg.firstElementChild.style = 'fill: gold;';
      } else {
        difficulty.classList.remove(ACTIVE_DIFFICULTY);
        svg.firstElementChild.style = 'fill: none;';
      }
    });
  }
}

export default PageIntro;

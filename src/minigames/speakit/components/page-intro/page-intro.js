// import loader from 'app/js/loader';
import utils from 'app/js/utils/utils';
import PageMain from '../page-main/page-main';

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
    };

    this.api = props.api;
    this.settings = props.settings;
    this.isDefaultMode = null;
  }

  async init() {
    this.isDefaultMode = this.settings.learningMode !== 'old';
    this.render();
    this.initElements();
    await this.initHandlers();

    console.log(this.settings);
  }

  render() {
    const fragment = new DocumentFragment();
    const template = document.createElement('template');

    // Control Buttons Logic (unset/set settings button)
    const renderSettings = () => {
      // If 'learning' mode is set -> unset settingsButton
      const ret = this.isDefaultMode
        ? '<button class="controls-container__settings-button">SETTINGS</button>'
        : '';

      return ret;
    };

    template.innerHTML = `
      <div class="page-intro animation-change-colors visually-hidden" style="background-image: url(/assets/img/speakit/bg-intro.svg)">
        <header class="page-intro__controls-block">
          <div class="wrapper">
            <ul class="controls-container">
              <li class="controls-container__group">
                <button class="controls-container__audio-button">${this.settings.minigames.speakit.isMute ? 'MUTED' : 'NOT MUTED'}</button>
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

    fragment.append(template.content);
    document.body.append(fragment);

    this.elements = {
      ...this.elements,
      root,
    };
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

    // If 'learning' mode is set -> unset settingsButton
    if (this.isDefaultMode) {
      const { CONTROLS_SETTINGS_BUTTON } = this.classes;
      const [settingsButton] = root.getElementsByClassName(CONTROLS_SETTINGS_BUTTON);

      this.elements.settingsButton = settingsButton;
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

    // Load image using async/await
    await utils.loadImage('/assets/img/speakit/bg-intro.svg');

    // Control Buttons Handlers
    audioButton.addEventListener('click', async () => {
      const { minigames: { speakit } } = this.settings;

      speakit.isMute = !speakit.isMute;

      audioButton.textContent = speakit.isMute ? 'MUTED' : 'NOT MUTED';

      await this.settings.update('speakit', speakit);

      // console.log();
    });

    // If 'learning' mode is set -> unset settingsButton
    if (settingsButton) {
      settingsButton.addEventListener('click', () => {
        console.log('Showed up modal');
      });
    }

    closeButton.addEventListener('click', () => {
      window.location.href = '/';
    });

    // Start Button Handlers
    startButton.addEventListener('click', async () => {
      const pageMain = new PageMain({
        api: this.api,
        round: this.isDefaultMode ? this.settings.minigames.speakit.round : -1,
        difficulty: this.isDefaultMode ? this.settings.minigames.speakit.difficulty : -1,
      });

      await pageMain.init();
      this.hide();
    });
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
}

export default PageIntro;

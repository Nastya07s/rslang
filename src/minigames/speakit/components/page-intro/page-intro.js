// import loader from 'app/js/loader';
import utils from 'app/js/utils/utils';
import PageMain from '../page-main/page-main';

class PageIntro {
  constructor(props) {
    this.elements = {};
    this.classes = {
      START_BUTTON: 'page-intro__start-button',
      CONTROLS_AUDIO_BUTTON: 'controls-container__audio-button',
      CONTROLS_SETTINGS_BUTTON: 'controls-container__settings-button',
      CONTROLS_CLOSE_BUTTON: 'controls-container__close-button',
    };

    this.settings = props.settings;
    this.isDefaultMode = null;
  }

  async init() {
    this.isDefaultMode = this.settings.learningWordsMode !== 'learning';
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
                <button class="controls-container__audio-button">AUDIO</button>
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
              <h2 class="page-intro__app-description">An application where you can listen to the pronunciation of English
                words and to check your pronunciation</h2>
              <p class="page-intro__app-how-to-use"><b class="page-intro__first-word">Click</b> on the words to hear their sound.</p>
              <p class="page-intro__app-how-to-use"><b class="page-intro__first-word">Click</b> on the button and say the
                words into the microphone.</p>
              <p class="page-intro__app-how-to-use"><b class="page-intro__first-word">Click</b> on the button below to get
                started.</p>
              <button class="page-intro__start-button animation-change-colors">Yes, but speak what?</button>
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
      CONTROLS_CLOSE_BUTTON,
      START_BUTTON,
    } = this.classes;
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
      closeButton,
      startButton,
    };
  }

  async initHandlers() {
    const {
      root,
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
    closeButton.addEventListener('click', () => {
    // If 'learning' mode is set -> unset settingsButton
      if (settingsButton) {
        settingsButton.addEventListener('click', () => {
          console.log('Showed up modal');
        });
      }

      window.location.href = '/';
    });

    // Start Button Handlers
    startButton.addEventListener('click', async () => {
      const pageMain = new PageMain({
        page: 0,
      });

      await pageMain.init();
      this.hide();
    });
  }

  hide() {
    const { root } = this.elements;

    root.classList.toggle('page-intro_hidden');
  }
}

export default PageIntro;

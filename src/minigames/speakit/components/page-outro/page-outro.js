import utils from 'app/js/utils/utils';
import settings from 'app/js/settings';

class PageOutro {
  constructor(props) {
    this.elements = {};
    this.classes = {
      PAGE_INTRO_HIDDEN: 'page-intro_hidden',
      VISUALLY_HIDDEN: 'visually-hidden',
      CONTROLS_AUDIO_BUTTON: 'controls-container__audio-button',
      PAGE_INTRO_MAIN: 'page-intro__main',
    };

    this.eventBus = props.eventBus;
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

    template.innerHTML = `
      <div class="page-intro animation-change-colors visually-hidden" style="background-image: url(/assets/img/speakit/bg-intro.jpg)">
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
            </ul>
          </div>
        </header>
        <main class="page-intro__main">
          <div class="wrapper">
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
      PAGE_INTRO_MAIN,
    } = this.classes;
    const [audioButton] = root.getElementsByClassName(CONTROLS_AUDIO_BUTTON);
    const [pageIntroMain] = root.getElementsByClassName(PAGE_INTRO_MAIN);

    this.elements = {
      ...this.elements,
      audioButton,
      pageIntroMain,
    };
  }

  async initHandlers() {
    const {
      root,
      audioButton,
    } = this.elements;

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
      this.eventBus.emit('audioVolumeChanged', speakit.isMute ? 0 : 1);
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

  showStatistics(data) {
    const { pageIntroMain } = this.elements;
    const pageIntroMainWrapper = pageIntroMain.firstElementChild;

    this.eventBus.emit('statistics.show', {
      element: pageIntroMainWrapper,
      ...data,
    });
  }
}

export default PageOutro;

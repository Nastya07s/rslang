// import loader from 'app/js/loader';
import PageMain from '../page-main/page-main';

class PageIntro {
  constructor(props) {
    this.elements = {};
    this.classes = {
      ROOT: props.rootClassName,
      START_BUTTON: 'page-intro__start-button',
    };
  }

  init() {
    this.render();
    this.initElements();
    this.initHandlers();
  }

  render() {
    const fragment = new DocumentFragment();
    const template = document.createElement('template');

    template.innerHTML = `
      <div class="page-intro">
        <main class="page-intro__main animation-change-colors">
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
      START_BUTTON,
    } = this.classes;
    const [startButton] = root.getElementsByClassName(START_BUTTON);

    this.elements = {
      ...this.elements,
      startButton,
    };
  }

  initHandlers() {
    const {
      // root,
      startButton,
    } = this.elements;

    // const animationTransition = (e) => {
    //   const { target } = e;
    //   const isRoot = target === root;

    //   if (!isRoot) {
    //     return;
    //   }

    //   console.log('Animation is end!');
    //   root.remove();
    // };

    // root.addEventListener('transitionend', animationTransition);

    startButton.addEventListener('click', this.handlerStartButton.bind(this));
  }

  async handlerStartButton() {
    const pageMain = new PageMain({
      page: 0,
    });

    await pageMain.init();
    this.hide();
  }

  hide() {
    const { root } = this.elements;

    const animationTransition = (e) => {
      const { target } = e;
      const isRoot = target === root;

      if (!isRoot) {
        return;
      }

      console.log('Animation is end!');
      root.remove();
    };

    root.addEventListener('transitionend', animationTransition);

    root.classList.toggle('page-intro_hidden');
  }
}

export default PageIntro;

class PopUp {
  constructor({
    element = document.body,
    title = '',
    description = '',
    handlerExitButton = () => {},
    handlerCancelButton = () => {},
    /*
      'pop-up': может быть всплывающее окно с Закрыть и Отмена
      'info': только ПОНЯТНО
    */
    type = 'pop-up',
  }) {
    this.elements = {
      parent: element,
    };
    this.classes = {
      ROOT: 'pop-up',
      EXIT_BUTTON: 'pop-up__exit-button',
      CANCEL_BUTTON: 'pop-up__cancel-button',
      ANIMATION_POP_UP: 'animation-pop-up',
      ANIMATION_POP_DOWN: 'animation-pop-down',
      NO_SCROLL: 'no-scroll',
    };
    this.title = title;
    this.description = description;
    this.handlerExitButton = handlerExitButton;
    this.handlerCancelButton = handlerCancelButton;
    this.type = type;
    this.isHidden = true;
    this.init();
  }

  init() {
    this.render();
    this.initElements();
    this.initHandlers();
  }

  render() {
    const fragment = new DocumentFragment();
    const template = document.createElement('template');

    const cancelButtonMarkup = this.modeWorker({
      popUpCallback: () => '<button class="pop-up__button pop-up__cancel-button">Отмена</button>',
      infoCallback: () => '',
    });
    const exitButtonTextMarkup = this.modeWorker({
      popUpCallback: () => 'Вернуться на главную',
      infoCallback: () => 'Понятно',
    });

    template.innerHTML = `
      <div class="pop-up pop-up_hidden">
        <div class="pop-up__wrapper">
          <h3 class="pop-up__title">${this.title}</h3>
          <p class="pop-up__description">${this.description}</p>
          <div class="pop-up__controls">
            <button class="pop-up__button pop-up__exit-button">${exitButtonTextMarkup}</button>
            ${cancelButtonMarkup}
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
      EXIT_BUTTON,
    } = this.classes;
    const [exitButton] = root.getElementsByClassName(EXIT_BUTTON);

    this.modeWorker({
      popUpCallback: () => {
        const { CANCEL_BUTTON } = this.classes;
        const [cancelButton] = root.getElementsByClassName(CANCEL_BUTTON);

        this.elements = {
          ...this.elements,
          cancelButton,
        };
      },
      infoCallback: () => {},
    });

    this.elements = {
      ...this.elements,
      exitButton,
    };
  }

  initHandlers() {
    const {
      exitButton,
    } = this.elements;

    // Control Buttons Handlers
    exitButton.addEventListener('click', () => {
      exitButton.disabled = true;
      this.handlerExitButton();
      exitButton.disabled = false;
    });

    this.modeWorker({
      popUpCallback: () => {
        const { cancelButton } = this.elements;

        cancelButton.addEventListener('click', () => {
          cancelButton.disabled = true;
          this.handlerCancelButton();
          cancelButton.disabled = false;

          this.toggle();
        });
      },
      infoCallback: () => {},
    });
  }

  toggle() {
    const { root } = this.elements;
    const {
      ANIMATION_POP_UP,
      ANIMATION_POP_DOWN,
      NO_SCROLL,
    } = this.classes;
    const popUpWrapper = root.firstElementChild;

    if (this.isHidden) {
      popUpWrapper.classList.add(ANIMATION_POP_UP);
      popUpWrapper.classList.remove(ANIMATION_POP_DOWN);
      document.body.classList.add(NO_SCROLL);
    } else {
      popUpWrapper.classList.remove(ANIMATION_POP_UP);
      popUpWrapper.classList.add(ANIMATION_POP_DOWN);

      popUpWrapper.onanimationend = (event) => {
        const { target } = event;

        if (!target) {
          return;
        }

        const isDifferentElement = target !== popUpWrapper;

        if (isDifferentElement) {
          return;
        }

        document.body.classList.remove(NO_SCROLL);
        root.remove();
      };
    }

    this.isHidden = !this.isHidden;
  }

  /**
   * Выполняет нужный колл-бэк, в зависимости от типа, переданного в аргументах класса.
   * @param {Object} param объект с двумя объектами, работающими как Promise (resolve, reject)
   */
  modeWorker({
    popUpCallback = () => {},
    infoCallback = () => {},
  } = {}) {
    let ret;

    switch (this.type) {
      case 'pop-up':
        ret = popUpCallback();
        break;
      case 'info':
      default:
        ret = infoCallback();
        break;
    }

    return ret;
  }
}

export default PopUp;

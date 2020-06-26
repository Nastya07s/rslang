const loaderSettings = {
  classes: {
    LOADER: 'loader',
    LOADER_HIDDEN: 'loader_hidden',
    VISUALLY_HIDDEN: 'visually-hidden',
  },
  loaderElement: null,

  onTransitionEnd: (e) => {
    const { target } = e;
    const {
      loaderElement,
      classes: { VISUALLY_HIDDEN },
    } = loaderSettings;
    const isLoader = target === loaderElement;

    if (isLoader) {
      loaderElement.classList.toggle(VISUALLY_HIDDEN);
    }
  },
};

const toggle = () => {
  let { loaderElement } = loaderSettings;

  if (!loaderElement) {
    const {
      onTransitionEnd,
      classes: { LOADER },
    } = loaderSettings;

    [loaderElement] = document.body.getElementsByClassName(LOADER);
    loaderElement.addEventListener('transitionend', onTransitionEnd);

    loaderSettings.loaderElement = loaderElement;
  }

  const { LOADER_HIDDEN } = loaderSettings.classes;

  loaderElement.classList.toggle(LOADER_HIDDEN);
};

export default {
  toggle,
};

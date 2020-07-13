const loaderSettings = {
  classes: {
    LOADER: 'loader',
    LOADER_HIDDEN: 'loader_hidden',
    VISUALLY_HIDDEN: 'visually-hidden',
  },
  loaderElement: null,
  timeOut: 350,

  onTransitionEnd: () => {
    const {
      loaderElement,
      classes: { VISUALLY_HIDDEN },
    } = loaderSettings;

    loaderElement.classList.toggle(VISUALLY_HIDDEN);
  },
};

const toggle = () => {
  let { loaderElement } = loaderSettings;

  if (!loaderElement) {
    const { classes: { LOADER } } = loaderSettings;

    [loaderElement] = document.body.getElementsByClassName(LOADER);
    loaderSettings.loaderElement = loaderElement;
  }

  const { LOADER_HIDDEN } = loaderSettings.classes;

  loaderElement.classList.toggle(LOADER_HIDDEN);

  const { onTransitionEnd, timeOut } = loaderSettings;

  setTimeout(onTransitionEnd, timeOut);
};

export default {
  toggle,
};

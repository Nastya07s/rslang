/**
 * Object contains all of the localizations for the potentially i18n.
 */
const localizations = {
  RU: {
    NO_CONNECTION: 'Нет соединения с интернетом!',
  },
};

const errorHandler = {
  // Error element's className
  ERROR_INFO_MESSAGE_CLASSNAME: 'error-info-message',
  // Human readable errors
  ERROR_STATUSES: {
    ...localizations.RU, // get all of the fields from russian locale
  },
  errorInfoElement: null,
  timerId: null,

  initElements() {
    [this.errorInfoElement] = document.getElementsByClassName(this.ERROR_INFO_MESSAGE_CLASSNAME);

    if (!this.errorInfoElement) {
      const errorInfoElement = document.createElement('p');

      errorInfoElement.classList.add(this.ERROR_INFO_MESSAGE_CLASSNAME);
      errorInfoElement.hidden = true;
      document.body.prepend(errorInfoElement);

      this.errorInfoElement = errorInfoElement;
    }
  },

  handle(err) {
    this.initElements();

    this.errorInfoElement.textContent = err;
    this.errorInfoElement.hidden = false;

    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }

    this.timerId = this.removeErrorMessage({ delay: 10000 });
  },

  removeErrorMessage({ delay }) {
    this.initElements();

    return setTimeout(() => {
      this.errorInfoElement.textContent = '';
      this.errorInfoElement.hidden = true;
    }, delay);
  },
};

export default errorHandler;

const errorHandler = {
  errorInfoElement: null,
  timerId: null,

  initElements() {
    const ERROR_INFO_MESSAGE_CLASSNAME = 'error-info-message';

    [this.errorInfoElement] = document.getElementsByClassName(ERROR_INFO_MESSAGE_CLASSNAME);

    if (!this.errorInfoElement) {
      const errorInfoElement = document.createElement('p');

      errorInfoElement.classList.add(ERROR_INFO_MESSAGE_CLASSNAME);
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

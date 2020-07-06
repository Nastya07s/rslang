class ProgressBar {
  constructor(props) {
    this.classes = {
      ROOT: 'progress-bar',
      CURRENT_VALUE: 'progress-bar__current-value',
      PROGRESS: 'progress-bar__progress',
      MAX_VALUE: 'progress-bar__max-value',
    };
    this.elements = {};
    this.currentValue = props.min;
    this.maxValue = props.max;
    this.init();
  }

  init() {
    this.initElements();
    this.initProgress();
  }

  initElements() {
    const {
      ROOT,
      CURRENT_VALUE,
      PROGRESS,
      MAX_VALUE,
    } = this.classes;

    const [root] = document.getElementsByClassName(ROOT);
    const [currentValue] = root.getElementsByClassName(CURRENT_VALUE);
    const [progress] = root.getElementsByClassName(PROGRESS);
    const [maxValue] = root.getElementsByClassName(MAX_VALUE);

    this.elements = {
      ...this.elements,
      root,
      currentValue,
      progress,
      maxValue,
    };
  }

  initProgress() {
    const {
      progress,
    } = this.elements;

    // Old browser support
    if (!progress.value) {
      progress.value = +progress.getAttribute('value');
    }

    if (!progress.max) {
      progress.max = +progress.getAttribute('max');
    }

    this.updateMarkup();
  }

  changeProgressBy(number) {
    // negative -> decrease progress, positive -> increase progress
    const newValue = this.currentValue + number;

    this.setProgressValue(newValue);
    this.updateMarkup();
  }

  setProgressValue(value) {
    let newValue;
    const isValueInBound = value >= 0 && value <= this.maxValue;


    if (isValueInBound) {
      newValue = value;
    } else {
      const isNegative = value < 0;

      newValue = isNegative ? 0 : this.maxValue;
    }

    this.currentValue = newValue;
  }

  updateMarkup() {
    const {
      progress,
      currentValue,
      maxValue,
    } = this.elements;

    currentValue.textContent = this.currentValue;
    maxValue.textContent = this.maxValue;
    progress.value = this.currentValue;
    progress.max = this.maxValue;
  }
}

export default ProgressBar;

import createElementDOM from './createElementDOM';

export default class GameFinishStatistics {
  constructor(container) {
    this.container = document.querySelector(container);
    this.titleMain = '';
    this.titleValid = '';
    this.titleInValid = '';

    this.vaildAnswers = '';
    this.inValidAnswers = '';

    this.defaultTitle = {
      bad: 'В этот раз не получилось, но продолжай тренироваться!',
      normal: 'Неплохо,но есть над чем поработать',
      good: 'Отличная работа !',
    };
  }

  hide() {
    this.container.style.display = 'none';
  }

  show(correctWords, inCorrectWords) {
    const numberCorrectWords = correctWords.length;
    const numberInCorrectWords = inCorrectWords.length;

    this.container.style.display = 'block';
    this.vaildAnswers.textContent = '';
    this.inValidAnswers.textContent = '';

    this.titleInValid.textContent = `ОШИБОК: ${numberInCorrectWords}`;
    this.titleValid.textContent = `ЗНАЮ: ${numberCorrectWords}`;

    if (numberInCorrectWords > numberCorrectWords) {
      this.titleMain.textContent = this.defaultTitle.bad;
    }
    if (numberInCorrectWords === 0) {
      this.titleMain.textContent = this.defaultTitle.good;
    }
    if (numberCorrectWords >= numberInCorrectWords) {
      this.titleMain.textContent = this.defaultTitle.normal;
    }

    //need refactor
    correctWords.forEach((element) => {
      const statisticsAnswer = createElementDOM('div', 'finish-statistics__answer', this.vaildAnswers);
      createElementDOM('div', 'finish-statistics__answer-audio', statisticsAnswer);
      createElementDOM('div', 'finish-statistics__answer-eng', statisticsAnswer).textContent = element;
      createElementDOM('div', 'finish-statistics__answer-dash', statisticsAnswer).textContent = '—';
      createElementDOM('div', 'finish-statistics__answer-ru', statisticsAnswer).textContent = element;
    });

    // need refactor
    inCorrectWords.forEach((element) => {
      const statisticsAnswer = createElementDOM('div', 'finish-statistics__answer', this.inValidAnswers);
      createElementDOM('div', 'finish-statistics__answer-audio', statisticsAnswer);
      createElementDOM('div', 'finish-statistics__answer-eng', statisticsAnswer).textContent = element;
      createElementDOM('div', 'finish-statistics__answer-dash', statisticsAnswer).textContent = '—';
      createElementDOM('div', 'finish-statistics__answer-ru', statisticsAnswer).textContent = element;
    });
  }

  render() {
    const finishStatistics = createElementDOM('div', 'finish-statistics', this.container);

    this.titleMain = createElementDOM('div', 'finish-statistics__title', finishStatistics);

    const wrapperAnswers = createElementDOM('div', 'wrapper__answers', finishStatistics);
    const statisticsAnswers = createElementDOM('div', 'finish-statistics__answers', wrapperAnswers);

    this.titleInValid = createElementDOM('div', 'finish-statistics__answers-invalid-title', statisticsAnswers);
    this.inValidAnswers = createElementDOM('div', 'finish-statistics__answers-invalid', statisticsAnswers);

    createElementDOM('div', 'finish-statistics__answers-line', statisticsAnswers);

    this.titleValid = createElementDOM('div', 'finish-statistics__answers-valid-title', statisticsAnswers);
    this.vaildAnswers = createElementDOM('div', 'finish-statistics__answers-valid', statisticsAnswers);

    const controlsButton = createElementDOM('div', 'finish-statistics__controls-button', finishStatistics);
    createElementDOM('button', 'restart-training', controlsButton).textContent = 'Продолжить тренировку';
    createElementDOM('button', 'finish-training', controlsButton).textContent = 'В галвное меню';
  }

  init() {
    this.render();
  }
}

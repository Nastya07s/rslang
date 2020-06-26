import createElementDOM from '../utils/createElementDOM';

export default class View {
  constructor() {
    this.game = document.querySelector('.game');
    this.containerWordsAnswers = document.querySelector('.game__answers');
    // this.wordsAnswers = document.querySelectorAll('.game__answer .word');
    this.startScreen = document.querySelector('.game-start');
    this.wordsAnswers = document.querySelectorAll('.game__answer');
    this.options = document.querySelector('.options');
    this.settings = document.querySelector('.options__settings');
    this.stars = document.querySelector('.stars');
    this.levels = document.querySelector('.options__levels select');
    this.wordDown = document.querySelector('.game__down-word');
    this.crystal = document.querySelector('.crystal');
    this.prelaunch = document.querySelector('.prelaunch');
    this.startBtn = document.querySelector('.game-start__start');
    this.counterLoader = document.querySelector('.loader__counter');
    this.containerHearts = document.querySelector('.hearts');
    this.hearts = document.querySelectorAll('.hearts__item');
    this.body = document.body;
    this.controllers = document.querySelector('.controllers');
    this.validStatistics = document.querySelector('.finish-statistics__answers-valid');
    this.inValidStatistics = document.querySelector('.finish-statistics__answers-invalid');
    this.validStatisticsTitle = document.querySelector('.finish-statistics__answers-valid-title');
    this.inValidStatisticsTitle = document.querySelector('.finish-statistics__answers-invalid-title');
    this.containerStatistics = document.querySelector('.savannah__statistics');
    this.restartTraining = document.querySelector('.restart-training');
  }

  setCounterInPrelaunch(number) {
    this.counterLoader.textContent = number;
  }

  showPrelaunch() {
    this.prelaunch.classList.add('active');
  }

  hidePrelaunch() {
    this.prelaunch.classList.remove('active');
  }

  hideStartScreen() {
    this.startScreen.classList.add('inactive');
  }

  showStartScreen() {
    this.startScreen.classList.remove('inactive');
  }

  showGame() {
    this.game.classList.add('active');
  }

  hideGame() {
    this.game.classList.remove('active');
  }

  showControllers() {
    this.controllers.classList.remove('inactive');
  }

  hideControllers() {
    this.controllers.classList.add('inactive');
  }

  showWordsAnswers(words) {
    this.wordsAnswers.forEach((item, index) => {
      const element = item;
      element.textContent = words[index];
      element.className = 'game__answer';
    });
  }

  onDisableAnswers() {
    this.wordsAnswers.forEach((item) => {
      const element = item;
      element.disabled = true;
    });
  }

  offDisableAnswers() {
    this.wordsAnswers.forEach((item) => {
      const element = item;
      element.disabled = false;
    });
  }

  showCorrectWord(word) {
    // console.log(this.findWord(word));
    this.findWord(word).classList.add('correct');
  }

  showInCorrectWord(word) {
    // console.log(this.findWord(word));
    this.findWord(word).classList.add('incorrect');
  }

  findWord(word) {
    return [...this.wordsAnswers].find((element) => element.textContent === word);
  }

  showWordDown(word) {
    this.wordDown.textContent = word;
    this.wordDown.className = 'game__down-word';
  }

  animateWordDown() {
    this.wordDown.classList.add('game__down-word_fall');
  }

  showStatistics(data) {
    this.containerStatistics.classList.add('active');
    let statisticsAnswer = '';
    this.validStatistics.textContent = '';
    this.inValidStatistics.textContent = '';
    this.validStatisticsTitle.textContent = `ЗНАЮ: ${data.filter((e) => e.isCorrect === true).length}`;
    this.inValidStatisticsTitle.textContent = `ОШИБОК: ${data.filter((e) => e.isCorrect === false).length}`;
    data
      .forEach((element) => {
        if (element.isCorrect === true) {
          statisticsAnswer = createElementDOM('div', 'finish-statistics__answer', this.validStatistics);
        }
        if (element.isCorrect === false) {
          statisticsAnswer = createElementDOM('div', 'finish-statistics__answer', this.inValidStatistics);
        }
        createElementDOM('div', 'finish-statistics__answer-audio', statisticsAnswer);
        createElementDOM('div', 'finish-statistics__answer-eng', statisticsAnswer).textContent = element.en;
        createElementDOM('div', 'finish-statistics__answer-dash', statisticsAnswer).textContent = '—';
        createElementDOM('div', 'finish-statistics__answer-ru', statisticsAnswer).textContent = element.ru;
      });
  }

  hideStatistics() {
    this.containerStatistics.classList.remove('active');
  }

  animateWordDownLose() {
    this.wordDown.classList.add('game__down-word_lose');
  }

  animateWordDownWin() {
    this.wordDown.classList.add('game__down-word_win');
  }

  showOptions() {
    this.options.classList.remove('icon_inactive');
  }

  hideOptions() {
    this.options.classList.add('icon_inactive');
  }

  updateHearts() {
    [...this.hearts].forEach((item) => {
      const element = item;
      element.className = 'hearts__item icon';
    });
  }

  showHearts() {
    this.containerHearts.classList.add('active');
  }

  hideHearts() {
    this.containerHearts.classList.remove('active');
  }

  showLoseHeart(heart) {
    [...this.hearts].reverse()[heart].classList.add('lose');
  }

  moveBackGround(value) {
    const currentPosition = getComputedStyle(this.body).backgroundPositionY.replace('%', ' ');
    this.body.style.backgroundPositionY = `${currentPosition - value}%`;
  }

  resetPositioBG() {
    this.body.style.backgroundPositionY = '100%';
  }

  updateCrystal(state) {
    this.crystal.className = `crystal crytal_state-${state}`;
  }

  setPositionFallWord() {
    this.wordDown.style.top = getComputedStyle(this.wordDown).top;
  }

  showStars(count) {
    [...this.stars.children].forEach((element) => {
      element.classList.remove('active');
    });
    [...this.stars.children].forEach((element, index) => {
      // console.log(element);
      if (index <= count) {
        element.classList.add('active');
      }
    });
    // console.log(this.stars.children);
  }

  showLevel(level) {
    this.levels.children[level].selected = 'true';
  }

  // bindStartGame(handler) {
  //   this.testStartBtn.addEventListener('click', () => {
  //     handler();
  //   });
  // }
  bindClickRestartTraining(handler) {
    this.restartTraining.addEventListener('click', () => {
      handler();
    });
  }

  bindClickStartGame(handler) {
    this.startBtn.addEventListener('click', () => {
      handler();
    });
  }

  bindClickAnswer(handler) {
    this.containerWordsAnswers.addEventListener('click', (e) => {
      const target = e.target.closest('.game__answer');
      if (target) {
        handler(target.textContent);
      }
    });
  }

  bindKeyDownAnswer() {
    document.addEventListener('keydown', (e) => {
      if (e.key >= 1 && e.key <= 4) {
        this.wordsAnswers[e.key - 1].click();
      }
    });
  }

  bindDropOptions() {
    this.options.addEventListener('click', (e) => {
      if (e.target === this.options) {
        this.settings.classList.toggle('options__settings_inactive');
      }
    });
  }

  bindChangeLevel(handler) {
    this.levels.addEventListener('change', (e) => {
      handler(e.target.value);
    });
  }

  bindChangeRound(handler) {
    // this.stars.addEventListener('mousemove', (e) => {
    //   // console.log(e.target.closest('.star'));
    //   const target = e.target.closest('.star');
    //   if (target) {
    //     this.fillStars(target.dataset.value);
    //   }
    // });

    // this.stars.addEventListener('mouseleave', (e) => {

    // });

    this.stars.addEventListener('click', (e) => {
      const target = e.target.closest('.star');
      if (target) {
        this.showStars(target.dataset.value);
        handler(target.dataset.value);
      }
    });
  }
}

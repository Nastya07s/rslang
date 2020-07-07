import createElementDOM from '../utils/createElementDOM';
/* eslint no-console: "off" */

export default class View {
  constructor() {
    this.game = document.querySelector('.game');
    this.containerWordsAnswers = document.querySelector('.game__answers');
    // this.wordsAnswers = document.querySelectorAll('.game__answer .word');
    this.dataLoader = document.querySelector('.backdrop');
    this.startScreen = document.querySelector('.game-start');
    this.wordsAnswers = document.querySelectorAll('.game__answer');
    this.options = document.querySelector('.options');
    this.settings = document.querySelector('.options__settings');
    this.stars = document.querySelector('.stars');
    this.levels = document.querySelector('.options__levels select');
    this.wordDown = document.querySelector('.game__down-word');
    this.crystal = document.querySelector('.game .crystal');
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
    this.sound = document.querySelector('.audio');
  }

  showControllers() {
    this.controllers.classList.remove('inactive');
  }

  hideControllers() {
    this.controllers.classList.add('inactive');
  }

  showPrelaunch() {
    this.prelaunch.classList.remove('inactive');
  }

  hidePrelaunch() {
    this.prelaunch.classList.add('inactive');
  }

  showStartScreen() {
    this.startScreen.classList.remove('inactive');
  }

  hideStartScreen() {
    this.startScreen.classList.add('inactive');
  }

  showGame() {
    this.game.classList.remove('inactive');
  }

  hideGame() {
    this.game.classList.add('inactive');
  }

  showDataLoader() {
    this.dataLoader.classList.remove('inactive');
  }

  hideDataLoader() {
    this.dataLoader.classList.add('inactive');
  }

  showOptions() {
    this.options.classList.remove('icon_inactive');
  }

  hideOptions() {
    this.options.classList.add('icon_inactive');
  }

  showStatistics(data) {
    this.containerStatistics.classList.remove('inactive');
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
        createElementDOM('div', 'finish-statistics__answer-eng', statisticsAnswer).textContent = element.word;
        createElementDOM('div', 'finish-statistics__answer-dash', statisticsAnswer).textContent = '—';
        createElementDOM('div', 'finish-statistics__answer-ru', statisticsAnswer).textContent = element.wordTranslate;
      });
  }

  hideStatistics() {
    this.containerStatistics.classList.add('inactive');
  }

  setCounterInPrelaunch(number) {
    this.counterLoader.textContent = number;
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
    if (word) {
      this.findWord(word).classList.add('correct');
    }
  }

  showInCorrectWord(word) {
    // console.log(this.findWord(word));
    if (word) {
      this.findWord(word).classList.add('incorrect');
    }
  }

  findWord(word) {
    return [...this.wordsAnswers].find((element) => element.textContent === word) || null;
  }

  showWordDown(word) {
    this.wordDown.textContent = word;
    this.wordDown.className = 'game__down-word';
  }

  animateWordDown() {
    this.wordDown.classList.add('game__down-word_fall');
  }


  animateWordDownLose() {
    this.wordDown.classList.add('game__down-word_lose');
  }

  animateWordDownWin() {
    this.wordDown.classList.add('game__down-word_win');
  }


  updateHearts() {
    [...this.hearts].forEach((item) => {
      const element = item;
      element.className = 'hearts__item icon';
    });
  }

  showHearts() {
    this.containerHearts.classList.remove('inactive');
  }

  hideHearts() {
    this.containerHearts.classList.add('inactive');
  }

  showLoseHeart(heart) {
    [...this.hearts].reverse()[heart].classList.add('lose');
  }

  moveBackGround(value) {
    const currentPosition = getComputedStyle(this.body).backgroundPositionY.replace('%', ' ');
    this.body.style.backgroundPositionY = `${currentPosition - value}%`;
  }

  updateBG() {
    this.body.style.backgroundPositionY = '100%';
  }

  updateCrystal(state) {
    console.log(state);
    this.crystal.className = `crystal crystal_state-${state}`;
  }

  setPositionFallWord() {
    this.wordDown.style.top = getComputedStyle(this.wordDown).top;
  }

  showDifficulty(count) {
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
  bindClickSound(handler) {
    this.sound.addEventListener('click', () => {
      this.sound.classList.toggle('audio_silence');
      handler();
    });
  }

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
        this.showDifficulty(target.dataset.value);
        handler(target.dataset.value);
      }
    });
  }
}

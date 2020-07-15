import createElementDOM from '../utils/createElementDOM';
/* eslint no-console: "off" */

export default class View {
  constructor() {
    this.game = document.querySelector('.game');
    this.containerWordsAnswers = document.querySelectorAll('.game__answers');
    this.dataLoader = document.querySelector('.backdrop');
    this.startScreen = document.querySelector('.game-start');
    this.wordsAnswers = document.querySelectorAll('.game__answer');
    this.options = document.querySelector('.options');
    this.settings = document.querySelector('.options__settings');
    this.stars = document.querySelector('.stars');
    this.levels = document.querySelector('.options__levels select');
    this.gameAudio = document.querySelector('.game__audio');
    this.gameCurrent = document.querySelector('.game__current');
    this.gameNext = document.querySelector('.game__next');
    this.idkBtns = document.querySelectorAll('.idk');
    this.nextGameBtns = document.querySelectorAll('.arrow-next');
    this.audioBtns = document.querySelectorAll('.game__audio');
    this.prelaunch = document.querySelector('.prelaunch');
    this.startBtn = document.querySelector('.game-start__start');
    this.body = document.body;
    this.controllers = document.querySelector('.controllers');
    this.finishStatistics = document.querySelector('.finish-statistics__answers');
    this.validStatistics = document.querySelector('.finish-statistics__answers-valid');
    this.inValidStatistics = document.querySelector('.finish-statistics__answers-invalid');
    this.validStatisticsTitle = document.querySelector('.finish-statistics__answers-valid-title');
    this.inValidStatisticsTitle = document.querySelector('.finish-statistics__answers-invalid-title');
    this.containerStatistics = document.querySelector('.audiocall__statistics');
    this.restartTraining = document.querySelector('.restart-training');
    this.sound = document.querySelector('.audio');
    this.close = document.querySelector('.close');
    this.dropGame = document.querySelector('.drop-game');
    this.dropGameBtn = document.querySelector('.drop-game-window__exit');
    this.dropGameBtnStatistics = document.querySelector('.finish-training');
    this.cancelDropGame = document.querySelector('.drop-game-window__cancel');
    this.progressGame = document.querySelector('.progress-game');
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

  showGameClose() {
    this.dropGame.classList.remove('inactive');
  }

  hideGameClose() {
    this.dropGame.classList.add('inactive');
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

  showClose() {
    this.close.classList.remove('icon_inactive');
  }

  hideClose() {
    this.close.classList.add('icon_inactive');
  }

  soundSilince(state) {
    if (state) {
      this.sound.classList.add('audio_silence');
    } else {
      this.sound.classList.remove('audio_silence');
    }
  }

  showSound() {
    this.sound.classList.remove('icon_inactive');
  }

  hideSound() {
    this.sound.classList.add('icon_inactive');
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
        statisticsAnswer.dataset.audio = element.audio;
        createElementDOM('div', 'finish-statistics__answer-audio', statisticsAnswer);
        createElementDOM('div', 'finish-statistics__answer-eng', statisticsAnswer).textContent = element.word;
        createElementDOM('div', 'finish-statistics__answer-dash', statisticsAnswer).textContent = '—';
        createElementDOM('div', 'finish-statistics__answer-ru', statisticsAnswer).textContent = element.wordTranslate;
      });
  }

  hideStatistics() {
    this.containerStatistics.classList.add('inactive');
  }

  hideCurrentGame() {
    this.gameCurrent.classList.add('inactive');
  }

  showAudioAnswer(audio) {
    const audioWrapper = this.body.querySelector('.game__next .game__audio');
    audioWrapper.dataset.audio = audio;
  }

  showImgAnswer(img) {
    const photoWrapper = this.body.querySelector('.game__next .game__photo img');
    const url = 'https://raw.githubusercontent.com/Gabriellji/rslang-data/master';
    photoWrapper.src = `${url}/${img}`;
  }

  showCurrentWord(word) {
    const wrapperEnglishWord = this.body.querySelector('.game__next .game__wordsEnglish');
    wrapperEnglishWord.textContent = word;
  }

  showWordAnsers(words) {
    const nextAnswersWrapper = this.body.querySelectorAll('.game__next .game__answer');
    nextAnswersWrapper.forEach((item, index) => {
      const element = item;
      element.textContent = words[index];
      element.className = 'game__answer';
    });
  }

  showProgressGame() {
    this.progressGame.classList.remove('inactive');
  }

  updateProgressGame(value) {
    this.progressGame.style.width = `${value}%`;
  }

  hideProgressGame() {
    this.progressGame.classList.add('inactive');
  }

  showCurrentGame() {
    this.gameCurrent.classList.add('animation');
    this.gameNext.classList.add('animation');
  }

  swapClassListGame() {
    this.gameCurrent.classList.remove('inactive');

    this.gameCurrent.classList.remove('animation');
    this.gameNext.classList.remove('animation');

    [this.gameCurrent.classList,
      this.gameNext.classList] = [this.gameNext.className, this.gameCurrent.className];
  }


  onDisableControllersGame() {
    [...this.nextGameBtns, ...this.idkBtns].forEach((element) => {
      const item = element;
      item.disabled = true;
    });
  }

  offDisableControllersGame() {
    [...this.nextGameBtns, ...this.idkBtns].forEach((element) => {
      const item = element;
      item.disabled = false;
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
    if (word) {
      this.findWord(word).classList.add('correct');
    }
    const wordsOther = this.body.querySelectorAll('.game__current .game__answer');
    wordsOther.forEach((element) => {
      if (element.textContent !== word) {
        element.classList.add('opacity');
      }
    });
  }

  showInCorrectWord(word) {
    if (word) {
      this.findWord(word).classList.add('incorrect');
    }
  }

  findWord(word) {
    const words = this.body.querySelectorAll('.game__current .game__answer');
    return [...words].find((element) => element.textContent === word) || null;
  }

  inActiveAllAudio() {
    const elements = this.body.querySelectorAll('.finish-statistics__answer-audio');
    elements.forEach((item) => item.classList.remove('active'));
  }

  showDifficulty(count) {
    [...this.stars.children].forEach((element) => {
      element.classList.remove('active');
    });
    [...this.stars.children].forEach((element, index) => {
      if (index <= count) {
        element.classList.add('active');
      }
    });
  }

  showLevel(level) {
    this.levels.children[level].selected = 'true';
  }


  swapVisibleBtnsControllerGame() {
    const currentIDK = this.body.querySelector('.game__current .idk');
    const currentNext = this.body.querySelector('.game__current .arrow-next');
    currentIDK.classList.add('inactive');
    currentNext.classList.remove('inactive');
  }

  hideIDKBtn() {
    const nextIDK = this.body.querySelector('.game__next .idk');
    nextIDK.classList.add('inactive');
  }

  showIDKBtn() {
    const nextIDK = this.body.querySelector('.game__next .idk');
    nextIDK.classList.remove('inactive');
  }

  hideNextGameBtn() {
    const nextGameBtn = this.body.querySelector('.game__next .arrow-next');
    nextGameBtn.classList.add('inactive');
  }

  showAnswerDescription() {
    const description = this.body.querySelector('.game__current .game__description');
    description.className = 'game__description game__description_answer';
  }

  hideAnswerDescription() {
    const description = this.body.querySelector('.game__next .game__description');
    description.className = 'game__description game__description_question';
  }

  bindClickCancel(handler) {
    this.cancelDropGame.addEventListener('click', () => {
      handler();
    });
  }

  bindClickIDK(handler) {
    this.idkBtns.forEach((element) => {
      element.addEventListener('click', () => {
        this.swapVisibleBtnsControllerGame();
        handler();
      });
    });
  }

  bindClickExitGame() {
    this.dropGameBtn.addEventListener('click', () => {
      window.location.href = '/';
    });
    this.dropGameBtnStatistics.addEventListener('click', () => {
      window.location.href = '/';
    });
  }

  bindClickNextGame(handler) {
    this.nextGameBtns.forEach((element) => {
      element.addEventListener('click', () => {
        handler();
      });
    });
  }

  clickAudioGame() {
    const audio = this.body.querySelector('.game__current .game__audio');
    audio.click();
  }

  bindClickAudioGame(handler) {
    this.audioBtns.forEach((element) => {
      element.addEventListener('click', (e) => {
        const target = e.target.closest('.game__audio');
        handler(target.dataset.audio);
      });
    });
  }

  bindClickAudioStatistics(handler) {
    this.finishStatistics.addEventListener('click', (e) => {
      // console.log(e.target);
      const { target } = e;
      if (
        target.classList.contains('finish-statistics__answer-audio')
        || target.classList.contains('finish-statistics__answer-eng')
      ) {
        this.inActiveAllAudio();
        const element = e.target.closest('.finish-statistics__answer');
        element.querySelector('.finish-statistics__answer-audio').classList.add('active');
        handler(element.dataset.audio);
      }
    });
  }

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
    this.containerWordsAnswers.forEach((element) => {
      element.addEventListener('click', (e) => {
        const target = e.target.closest('.game__answer');
        if (target) {
          handler(target.textContent);
        }
      });
    });
  }

  bindKeyDownAnswer() {
    document.addEventListener('keydown', (e) => {
      if (e.key >= 1 && e.key <= 5) {
        const currentAnswersWrapper = this.body.querySelectorAll('.game__current .game__answer');
        currentAnswersWrapper[e.key - 1].click();
      }
      if (e.key === 'Enter') {
        const currentNextBtn = this.body.querySelector('.game__current .arrow-next');
        const currentIDK = this.body.querySelector('.game__current .idk');

        if (!currentNextBtn.classList.contains('inactive')) {
          currentNextBtn.click();
        }
        if (!currentIDK.classList.contains('inactive')) {
          currentIDK.click();
        }
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

  bindClickClose(handler) {
    this.close.addEventListener('click', () => {
      handler();
    });
  }

  bindChangeRound(handler) {
    this.stars.addEventListener('click', (e) => {
      const target = e.target.closest('.star');
      if (target) {
        this.showDifficulty(target.dataset.value);
        handler(target.dataset.value);
      }
    });
  }
}

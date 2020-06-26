// const TIME_PRELAUNCH = 3;
// const TIME_RESPONSE = 5;
/* eslint no-console: "off" */
export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.timer = '';
    this.view.bindClickStartGame(this.handlerStartGame.bind(this));
    this.view.bindClickAnswer(this.handlerAnswer.bind(this));
    this.view.bindKeyDownAnswer();
    this.view.bindDropOptions();
    this.view.bindChangeRound(this.handlerChangeRound.bind(this));
    this.view.bindChangeLevel(this.handlerChangeLevel.bind(this));
    this.view.bindClickRestartTraining(this.init.bind(this));
    // this.init();
  }

  init() {
    this.model.initRoundLevel();
    this.view.showStars(this.model.round);
    this.view.showLevel(this.model.level);
    this.view.showControllers();
    this.view.showOptions();
    this.view.showStartScreen();
    this.view.resetPositioBG();
    this.view.hideStatistics();
    this.view.updateHearts();
  }

  handlerChangeRound(round) {
    this.model.setRound(round);
  }

  handlerChangeLevel(level) {
    this.model.setLevel(level);
  }

  async handlerStartGame() {
    await this.model.init();
    this.view.hideStartScreen();
    this.view.hideOptions();
    this.view.hideControllers();
    this.startGameLoader();
  }

  startGameLoader() {
    this.view.showPrelaunch();
    this.prelaunchTimer();
  }

  handlerAnswer(word) {
    this.view.setPositionFallWord();
    this.view.onDisableAnswers();
    clearInterval(this.timer);
    this.delayBeforeNextWord();
    if (word === this.model.currentCorrectWord.ru) {
      this.view.moveBackGround(this.model.valueMoveBg);
      this.view.animateWordDownWin();
      this.view.showCorrectWord(word);
      this.model.setStateCorrect(true);
    } else {
      this.view.animateWordDownLose();
      this.view.showCorrectWord(this.model.currentCorrectWord.ru);
      this.view.showInCorrectWord(word);
      this.model.hearts -= 1;
      this.view.showLoseHeart(this.model.hearts);
      this.model.setStateCorrect(false);
    }
  }

  prelaunchTimer() {
    let counter = 3;
    this.view.setCounterInPrelaunch(counter);
    this.timer = setInterval(() => {
      counter -= 1;
      if (counter === 0) {
        clearInterval(this.timer);
        this.gameStart();
      } else {
        this.view.setCounterInPrelaunch(counter);
      }
    }, 1000);
  }

  gameStart() {
    this.view.hidePrelaunch();
    this.view.showGame();
    this.view.showHearts();
    this.view.showControllers();
    this.nextWord();
  }

  gameTimer() {
    this.timer = setInterval(() => {
      this.view.onDisableAnswers();
      this.view.setPositionFallWord();
      this.view.animateWordDownLose();
      this.view.showCorrectWord(this.model.currentCorrectWord.ru);
      this.model.hearts -= 1;
      this.view.showLoseHeart(this.model.hearts);
      // this.timer.
      this.model.setStateCorrect(false);
      clearInterval(this.timer);
      this.delayBeforeNextWord();
    }, 5000);
  }

  delayBeforeNextWord() {
    this.timer = setInterval(() => {
      clearInterval(this.timer);
      this.nextWord();
    }, 1200);
  }

  nextWord() {
    if (this.model.hearts !== 0 && this.model.currentWordNumber >= 0) {
      this.model.setNextWord();
      this.model.currentWordNumber -= 1;
      this.view.offDisableAnswers();
      this.view.showWordDown(this.model.currentCorrectWord.en);
      this.view.showWordsAnswers(this.model.currentWordsAnswers);
      this.view.animateWordDown();
      this.gameTimer();
    } else {
      this.view.hideGame();
      this.view.hideHearts();
      this.view.showStatistics(this.model.getWordsForStatistics());
      this.view.hideControllers();
      // this.model.recordStatistics();
      console.log('record statistics');
      console.log(this.model.roundWords);
      // console.log(this.model.roundWords);
    }
  }

  // recordStatistics() {

  // }

  // pauseGame() {

  // }

  // closeGame() {

  // }
}

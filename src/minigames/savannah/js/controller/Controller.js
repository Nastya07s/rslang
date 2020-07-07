/* eslint no-console: "off" */
// const RESPONSE_TIME = 5000;
export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.timerGame = '';
    this.view.bindClickStartGame(this.handlerStartGame.bind(this));
    this.view.bindClickAnswer(this.handlerAnswer.bind(this));
    this.view.bindKeyDownAnswer();
    this.view.bindDropOptions();
    this.view.bindChangeRound(this.handlerChangeRound.bind(this));
    this.view.bindChangeLevel(this.handlerChangeLevel.bind(this));
    this.view.bindClickRestartTraining(this.init.bind(this));
    this.view.bindClickSound(this.handlerClickSound.bind(this));
    // console.log('init');
  }

  async init() {
    this.view.showDataLoader();
    this.view.hideControllers();
    this.view.hidePrelaunch();
    this.view.hideStartScreen();
    this.view.hideGame();
    this.view.hideStatistics();
    this.view.hideHearts();
    this.view.updateHearts();
    this.view.updateBG();
    this.view.updateCrystal(1);
    // this.view.showOptions();
    await this.model.init();
    this.view.showDifficulty(this.model.round);
    this.view.showLevel(this.model.level);
    console.log(this.model.gameMode);
    // if (this.model.gameMode === 'mix') {
    //   this.view.hideOptions();
    // }
    this.view.hideDataLoader();
    this.view.showControllers();
    this.view.showStartScreen();
  }


  async handlerStartGame() {
    // await this.model.initGame();

    this.view.hideStartScreen();
    this.view.hideOptions();
    this.view.hideControllers();
    this.view.showPrelaunch();
    await this.model.initGame();
    setTimeout(() => {
      this.view.hidePrelaunch();
      this.view.showGame();
      this.view.showControllers();
      this.view.showHearts();
      this.nextWord();
    }, 2000);
    console.log('words game : ', this.model.gameWords);
    console.log('words game answers : ', this.model.gameWordsAnswers);
  }

  handlerClickSound() {
    console.log(this.model);
  }

  handlerAnswer(word) {
    this.view.setPositionFallWord();
    this.view.onDisableAnswers();
    clearTimeout(this.timerGame);
    this.delayBeforeNextWord();

    if (word === this.model.currentCorrectWord.ru) {
      this.correctAnswer(word);
    } else {
      this.inCorrectAnswer(word);
    }
  }

  handlerChangeRound(round) {
    this.model.setRound(round);
  }

  handlerChangeLevel(level) {
    this.model.setLevel(level);
  }

  correctAnswer(word) {
    this.view.moveBackGround(this.model.valueMoveBg);
    this.view.animateWordDownWin();
    this.view.showCorrectWord(word);
    this.model.setStateCorrect(true);
    this.model.valueUpCrystal -= 1;
  }

  inCorrectAnswer(word) {
    this.view.animateWordDownLose();
    this.view.showCorrectWord(this.model.currentCorrectWord.ru);
    this.view.showInCorrectWord(word);
    this.model.hearts -= 1;
    this.view.showLoseHeart(this.model.hearts);
    this.model.setStateCorrect(false);
  }

  gameTimer() {
    this.timerGame = setTimeout(() => {
      this.handlerAnswer();
    }, 5000);
  }

  delayBeforeNextWord() {
    setTimeout(() => {
      this.nextWord();
    }, 1200);
  }

  async nextWord() {
    if (this.model.hearts !== 0 && this.model.currentWordNumber >= 0) {
      this.model.setNextWord();
      this.model.currentWordNumber -= 1;
      this.view.offDisableAnswers();
      this.view.showWordDown(this.model.currentCorrectWord.en);
      this.view.showWordsAnswers(this.model.currentWordsAnswers);
      this.view.animateWordDown();
      if (this.model.updateCrystal()) {
        this.view.updateCrystal(this.model.currentStateCrystal);
      }
      this.gameTimer();
    } else {
      this.view.hideGame();
      this.view.hideHearts();
      this.view.hideControllers();
      this.view.showDataLoader();
      await this.model.recordStatisticsWords();
      await this.model.recordStatisticsGame();
      this.view.hideDataLoader();
      this.view.showStatistics(this.model.getWordsForStatistics());
    }
  }
}

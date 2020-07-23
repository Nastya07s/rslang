/* eslint no-console: "off" */
const DEFAULT_GAME_TIME = 5000;
const PRELAUNCH_TIME = 2000;
const DELAY_NEXT_WORD = 1200;

export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.timerGame = '';
    this.isTimerGame = null;
    this.timePause = 0;
    this.timeStart = 0;
    this.timeDifference = 0;

    this.view.bindClickStartGame(this.handlerStartGame.bind(this));
    this.view.bindClickAnswer(this.handlerAnswer.bind(this));
    this.view.bindKeyDownAnswer();
    this.view.bindDropOptions();
    this.view.bindChangeRound(this.handlerChangeRound.bind(this));
    this.view.bindChangeLevel(this.handlerChangeLevel.bind(this));
    this.view.bindClickRestartTraining(this.init.bind(this));
    this.view.bindClickSound(this.handlerClickSound.bind(this));
    this.view.bindClickClose(this.handlerClickClose.bind(this));
    this.view.bindClickCancel(this.handlerClickCancel.bind(this));
    this.view.bindClickAudioStatistics(this.handlerClickAudioStatistics.bind(this));
    this.view.bindClickExitGame();
    this.view.bindClickBulb(this.handlerClickBulb.bind(this));
    this.model.audio.addEventListener('ended', () => {
      this.view.inActiveAllAudio();
    });
  }

  async init() {
    this.view.hideSound();
    this.view.hideBulb();
    this.view.showClose();
    this.view.onDisableAnswers();
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
    this.view.showOptions();
    await this.model.init();
    this.view.showDifficulty(this.model.round);
    this.view.showLevel(this.model.level);
    this.view.soundSilince(this.model.audioMute);
    console.log(this.model.gameMode);
    if (this.model.gameMode !== 'mix') {
      this.view.hideOptions();
    }
    this.view.hideDataLoader();
    this.view.showControllers();
    this.view.showStartScreen();
  }

  async handlerStartGame() {
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
      this.view.showBulb();
      this.nextWord();
    }, PRELAUNCH_TIME);
    console.log('GAME WORDS', this.model.gameWords);
    console.log('WORDS FOR ANSWER', this.model.gameWordsAnswers);
  }

  handlerAnswer(word) {
    this.view.setPositionFallWord();
    this.view.onDisableAnswers();
    this.view.onDisableBulb();
    clearTimeout(this.timerGame);
    this.timeDifference = 0;
    this.delayBeforeNextWord();
    if (word === this.model.currentCorrectWord.ru) {
      this.correctAnswer(word);
    } else {
      this.inCorrectAnswer(word);
    }
  }

  handlerClickBulb() {
    this.view.hintAnswer(this.model.currentCorrectWord.ru);
  }

  handlerChangeRound(round) {
    this.model.setRound(round);
  }

  handlerClickCancel() {
    this.view.hideGameClose();
    this.unPauseGame();
    switch (this.isTimerGame) {
      case false:
        this.delayBeforeNextWord(this.timeDifference);
        break;
      case true:
        this.gameTimer(this.timeDifference);
        break;
      default:
        break;
    }
  }

  handlerClickClose() {
    if (!this.model.gameActive) {
      window.location.href = '/main';
    } else {
      this.view.showGameClose();
      this.pauseGame();
      switch (this.isTimerGame) {
        case false:
          this.timeDifference = this.timeDifference || DELAY_NEXT_WORD;
          break;
        case true:
          this.timeDifference = this.timeDifference || DEFAULT_GAME_TIME;
          break;
        default:
          break;
      }
      clearTimeout(this.timerGame);
      this.timePause = Date.now();
      this.timeDifference -= (this.timePause - this.timeStart);
    }
  }

  pauseGame() {
    this.view.pauseAnimationWord();
  }

  unPauseGame() {
    this.view.unPauseAnimationWord();
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

  gameTimer(time) {
    this.isTimerGame = true;
    this.timeStart = Date.now();
    this.timerGame = setTimeout(() => {
      this.handlerAnswer();
    }, time || DEFAULT_GAME_TIME);
  }

  delayBeforeNextWord(time) {
    this.isTimerGame = false;
    this.timeStart = Date.now();
    this.timerGame = setTimeout(() => {
      this.nextWord();
    }, time || DELAY_NEXT_WORD);
  }

  handlerClickSound() {
    this.model.setMuteAudio();
  }

  handlerClickAudioStatistics(src) {
    this.model.playSound(src);
  }

  async nextWord() {
    this.timeDifference = 0;
    clearTimeout(this.timerGame);
    if (this.model.hearts !== 0 && this.model.currentWordNumber >= 0) {
      this.model.setNextWord();
      this.model.currentWordNumber -= 1;
      this.view.offDisableAnswers();
      this.view.offDisableBulb();
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
      this.view.hideBulb();
      this.view.hideClose();
      this.view.hideControllers();
      this.view.showDataLoader();
      this.view.showControllers();
      this.view.showSound();
      await this.model.recordStatisticsWords();
      await this.model.recordStatisticsGame();
      this.view.hideDataLoader();
      this.view.showStatistics(this.model.getWordsForStatistics());
    }
  }
}

/* eslint no-console: "off" */
const PRELAUNCH_TIME = 2000;
const DELAY_NEXT_WORD = 1200;

export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindClickStartGame(this.handlerStartGame.bind(this));
    this.view.bindChangeRound(this.handlerChangeRound.bind(this));
    this.view.bindChangeLevel(this.handlerChangeLevel.bind(this));
    this.view.bindDropOptions();
    this.view.bindClickRestartTraining(this.init.bind(this));
    this.view.bindClickSound(this.handlerClickSound.bind(this));
    this.view.bindClickClose(this.handlerClickClose.bind(this));
    this.view.bindClickCancel(this.handlerClickCancel.bind(this));
    this.view.bindClickIDK(this.handlerClickIDK.bind(this));
    this.view.bindClickNextGame(this.handlerClickNextGame.bind(this));
    this.view.bindKeyDownAnswer();
    this.view.bindClickAudioGame(this.handlerAudioGame.bind(this));
    this.view.bindClickAnswer(this.handlerAnswer.bind(this));
    this.view.bindClickExitGame();
    this.view.bindClickAudioStatistics(this.handlerClickAudioStatistics.bind(this));
    this.model.audio.addEventListener('ended', () => {
      if (!this.model.gameActive) {
        this.view.inActiveAllAudio();
      }
    });
  }

  async init() {
    this.view.onDisableAnswers();
    this.view.onDisableControllersGame();
    this.view.updateProgressGame(0);
    this.view.hideControllers();
    this.view.hideGame();
    this.view.hideCurrentGame();
    this.view.hideStartScreen();
    this.view.hideStatistics();
    this.view.showDataLoader();
    await this.model.init();
    this.view.hideDataLoader();
    this.view.showClose();
    this.view.hideStatistics();
    this.view.showOptions();
    this.view.showDifficulty(this.model.round);
    this.view.showLevel(this.model.level);
    this.view.soundSilince(this.model.audioMute);
    if (this.model.gameMode !== 'mix') {
      this.view.hideOptions();
    }
    this.view.showControllers();
    this.view.showStartScreen();
  }


  async handlerStartGame() {
    console.log('start game');
    this.view.hideStartScreen();
    this.view.hideOptions();
    this.view.hideControllers();
    this.view.showPrelaunch();
    await this.model.initGame();
    setTimeout(() => {
      this.view.hidePrelaunch();
      this.view.showGame();
      this.view.showControllers();
      this.nextWord();
      console.log('GAME WORDS', this.model.gameWords);
      console.log('WORDS FOR ANSWER', this.model.gameWordsAnswers);
    }, PRELAUNCH_TIME);
  }

  handlerAudioGame(src) {
    this.model.playSound(src);
  }

  handlerClickIDK() {
    this.view.onDisableAnswers();
    this.view.showAnswerDescription();
    this.inCorrectAnswer();
    this.model.updateProgress();
    this.view.updateProgressGame(this.model.currentValueMoveProgress);
    console.log('click idk');
  }

  handlerClickNextGame() {
    console.log('click next game');
    this.nextWord();
  }

  handlerAnswer(word) {
    this.view.onDisableAnswers();
    this.view.swapVisibleBtnsControllerGame();
    this.view.showAnswerDescription();
    this.model.updateProgress();
    this.view.updateProgressGame(this.model.currentValueMoveProgress);
    if (word === this.model.currentCorrectWord.ru) {
      this.correctAnswer(word);
    } else {
      this.inCorrectAnswer(word);
    }
  }

  correctAnswer(word) {
    this.view.showCorrectWord(word);
    this.model.setStateCorrect(true);
  }

  inCorrectAnswer(word) {
    this.view.showCorrectWord(this.model.currentCorrectWord.ru);
    this.view.showInCorrectWord(word);
    this.model.setStateCorrect(false);
  }

  handlerChangeRound(round) {
    this.model.setRound(round);
  }

  handlerChangeLevel(level) {
    this.model.setLevel(level);
  }

  handlerClickCancel() {
    this.view.hideGameClose();
  }

  handlerClickClose() {
    if (!this.model.gameActive) {
      window.location.href = '/main';
    } else {
      this.view.showGameClose();
    }
  }

  handlerClickSound() {
    this.model.setMuteAudio();
  }

  handlerClickAudioStatistics(src) {
    this.model.playSound(src);
  }

  async nextWord() {
    if (this.model.currentWordNumber >= 0) {
      this.model.setNextWord();
      console.log('correct word en : ', this.model.currentCorrectWord.en);
      console.log('correct word ru : ', this.model.currentCorrectWord.ru);
      this.view.showCurrentWord(this.model.gameWords[this.model.currentWordNumber].wordTranslate);
      this.view.showAudioAnswer(this.model.gameWords[this.model.currentWordNumber].audio);
      this.view.showImgAnswer(this.model.gameWords[this.model.currentWordNumber].image);
      this.model.currentWordNumber -= 1;
      this.view.showWordAnsers(this.model.currentWordsAnswers);
      this.view.showCurrentGame();
      this.view.onDisableControllersGame();

      setTimeout(() => {
        this.view.swapClassListGame();
        this.view.clickAudioGame();
        this.view.offDisableAnswers();
        this.view.offDisableControllersGame();
        this.view.hideNextGameBtn();
        this.view.showIDKBtn();
        this.view.hideAnswerDescription();
      }, DELAY_NEXT_WORD);
    } else {
      this.view.onDisableControllersGame();
      this.view.hideGame();
      this.view.hideClose();
      this.view.hideControllers();
      this.view.showDataLoader();
      this.view.showControllers();
      this.model.gameActive = false;
      await this.model.recordStatisticsWords();
      await this.model.recordStatisticsGame();
      this.view.hideDataLoader();
      this.view.showStatistics(this.model.getWordsForStatistics());
    }
  }
}

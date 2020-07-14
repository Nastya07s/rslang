/* eslint-disable class-methods-use-this */
/* eslint-disable prefer-destructuring */
import 'app/index';
import './scss/main.scss';
import View from './js/View/View';
import Model from './js/model/Model';

const readCoordsFromAttribute = (element) => {
  const attrValue = element.getAttribute('data-coordinate');

  if (!attrValue) {
    return null;
  }

  const cordArray = attrValue.split('_');

  if (cordArray.length !== 2) {
    return null;
  }

  return [
    parseInt(cordArray[0], 10),
    parseInt(cordArray[1], 10)];
};

export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.isMouseDown = false;
    this.isUserRight = false;
    this.selectLetters = [];

    this.view.bindChangeRound(this.handlerChangeRound.bind(this));
    this.view.bindChangeLevel(this.handlerChangeLevel.bind(this));
    this.view.bindClickClose(this.handlerClickClose.bind(this));
    this.view.bindDropOptions();
    this.view.bindClickStartGame(this.handlerClickStartGame.bind(this));
    this.view.bindClickSound(this.handlerClickSound.bind(this));
    this.view.bindClickHelp(this.handlerClickHelp.bind(this));
    this.view.bindClickRefresh(this.handlerClickRefresh.bind(this));
    this.view.bindClickTable(this.handlerMouseUp.bind(this));
    this.view.bindClickRestartTraining(this.handlerClickRestartTraining.bind(this));
    this.view.bindClickFinishTraining(this.handlerClickFinishTraining.bind(this));
    this.view.bindClickNextWord(this.handlerClickNextWord.bind(this));
  }

  async init() {
    await this.model.init();
    this.view.showDifficulty(this.model.gameSettings.difficulty);
  }

  async handlerClickStartGame() {
    this.view.hideOptions();
    this.view.hideSound();
    this.view.hideDropOptions();
    this.view.hideStartPage();
    this.view.showLouder();
    await this.model.initGameWords();
    setTimeout(() => {
      this.view.hideLouder();
      this.view.showFillWord();
      this.gameStart();
    }, 3000);
  }

  async handlerClickRestartTraining() {
    this.view.clearStyleResult();
    this.view.clearChooseWordContainer();
    this.view.deleteOldGameTable();
    this.view.hideStatistics();
    this.view.showLouder();
    await this.model.initGameWords();
    setTimeout(() => {
      this.view.hideLouder();
      this.view.showFillWord();
      this.gameStart();
    }, 3000);
  }

  gameStart() {
    this.model.initGameField();
    this.model.wordsService.updateRepetition(this.model.gameWord.id, this.difficultGroup);
    this.view.addWordTranslateText(this.model.gameWord.ru);
    this.view.renderField(this.model.field,
      this.mouseMoveHandler.bind(this),
      this.mouseDownHandler.bind(this));
  }

  handlerClickRefresh() {
    this.selectLetters = [];
    this.model.initGameField();
    this.view.deleteOldGameTable();
    this.view.renderField(this.model.field,
      this.mouseMoveHandler.bind(this),
      this.mouseDownHandler.bind(this));
  }

  handlerClickHelp() {
    this.model.playSound();
  }

  handlerClickSound() {
    this.model.setMuteAudio();
  }

  handlerChangeRound(round) {
    this.model.setRound(round);
  }

  handlerChangeLevel(level) {
    this.model.setLevel(level);
  }

  handlerClickClose() {
    window.location.href = '/';
  }

  handlerClickFinishTraining() {
    window.location.href = '/fillword';
  }

  handlerClickNextWord() {
    this.model.addAnswerResult();
    this.model.gameRound += 1;
    this.initRound();
  }

  handlerMouseUp() {
    this.isMouseDown = false;

    if (this.isUserRight) {
      this.view.showCorrectResult();
      this.model.wordsService.updateKnowledge(this.model.gameWord.id, this.difficultGroup);
      this.model.isCorrectAnswer();
    } else {
      this.view.showIncorrectResult();
    }
    this.model.addAnswerResult();
    this.model.gameRound += 1;

    if (this.model.gameRound === this.model.gameWords.length) {
      this.model.gameRound = 0;
      this.view.hideFillWord();
      this.view.renderStatistics(this.model.arrayAnswer);
      return;
    }

    setTimeout(() => {
      this.initRound();
      this.isUserRight = false;
      this.selectLetters = [];
    }, 1000);
  }

  initRound() {
    this.model.getWord();
    this.model.coordinate = [];
    this.model.initGameField();
    this.model.chooseCoord = [];
    this.view.deleteOldGameTable();
    this.view.addWordTranslateText(this.model.gameWord.ru);
    this.view.renderField(this.model.field,
      this.mouseMoveHandler.bind(this),
      this.mouseDownHandler.bind(this));
    this.view.clearStyleResult();
    this.view.clearChooseWordContainer();
    View.removeSelectCell();
  }

  mouseMoveHandler(event) {
    if (this.isMouseDown) {
      event.currentTarget.classList.add('select');
    }

    if (this.selectLetters.length !== 0
      && this.selectLetters[this.selectLetters.length - 1] !== event.currentTarget.innerText
      && this.isMouseDown) {
      this.selectLetters.push(event.currentTarget.innerText);
      this.view.innerWord.innerText = this.selectLetters.join('');
      return;
    }

    if (!this.isMouseDown || !this.isUserRight) {
      return;
    }

    const currentCord = readCoordsFromAttribute(event.target);

    if (this.model.chooseCoord.length !== 0
      && this.model.chooseCoord[this.model.chooseCoord.length - 1][0] === currentCord[0]
      && this.model.chooseCoord[this.model.chooseCoord.length - 1][1] === currentCord[1]) {
      return;
    }

    this.isUserRight = this.model.coordinate.length > this.model.chooseCoord.length
      && this.model.coordinate[this.model.chooseCoord.length][0] === currentCord[0]
      && this.model.coordinate[this.model.chooseCoord.length][1] === currentCord[1];

    if (this.isUserRight) {
      this.model.chooseCoord.push(currentCord);
    }
  }

  mouseDownHandler(event) {
    this.isMouseDown = true;

    const currentCord = readCoordsFromAttribute(event.currentTarget);

    this.isUserRight = !!currentCord
      && this.model.coordinate[0][0] === currentCord[0]
      && this.model.coordinate[0][1] === currentCord[1];

    if (this.isUserRight) {
      this.model.chooseCoord.push(currentCord);
    }
    this.selectLetters.push(event.currentTarget.innerText);
    this.view.innerWord.innerText = this.selectLetters.join('');
  }
}

const model = new Model();
const view = new View();
const controller = new Controller(model, view);
controller.init();

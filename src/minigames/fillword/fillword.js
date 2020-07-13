/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
/* eslint-disable prefer-destructuring */
import './scss/main.scss';
import View from './js/View/View';
/* import createField from './js/createField/createField'; */
import Model from './js/model/Model';

/* let chooseCoordinate = [];
let innerArrWord = [];
let keyWord = [];
let field = []; */

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

/* const mouseMoveHandler = (event) => {
  if (isMouseDown) {
    event.currentTarget.classList.add('select');
  }

  if (innerArrWord.length !== 0
    && innerArrWord[innerArrWord.length - 1] !== event.currentTarget.innerText
    && isMouseDown) {
    innerArrWord.push(event.currentTarget.innerText);
    innerWord.innerText = innerArrWord.join('');
    return;
  }

  if (!isMouseDown || !isUserRight) {
    return;
  }

  const currentCord = readCoordsFromAttribute(event.target);

  if (chooseCoordinate.length !== 0
    && chooseCoordinate[chooseCoordinate.length - 1][0] === currentCord[0]
    && chooseCoordinate[chooseCoordinate.length - 1][1] === currentCord[1]) {
    return;
  }

  isUserRight = coordinate.length > chooseCoordinate.length
    && coordinate[chooseCoordinate.length][0] === currentCord[0]
    && coordinate[chooseCoordinate.length][1] === currentCord[1];

  if (isUserRight) {
    chooseCoordinate.push(currentCord);
  }
};

const mouseDownHandler = (event) => {
  isMouseDown = true;

  const currentCord = readCoordsFromAttribute(event.currentTarget);

  isUserRight = !!currentCord
    && coordinate[0][0] === currentCord[0]
    && coordinate[0][1] === currentCord[1];

  if (isUserRight) {
    chooseCoordinate.push(currentCord);
  }
  innerArrWord.push(event.currentTarget.innerText);
  innerWord.innerText = innerArrWord.join('');
}; */

export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.isMouseDown = false;
    this.isUserRight = false;

    this.view.bindChangeRound(this.handlerChangeRound.bind(this));
    this.view.bindChangeLevel(this.handlerChangeLevel.bind(this));
    this.view.bindClickClose(this.handlerClickClose.bind(this));
    this.view.bindDropOptions();
    this.view.bindClickStartGame(this.handlerClickStartGame.bind(this));
    this.view.bindClickSound(this.handlerClickSound.bind(this));
    this.view.bindClickHelp(this.handlerClickHelp.bind(this));
    this.view.bindClickRefresh(this.handlerClickRefresh.bind(this));
    this.view.bindClickTable(this.handlerMouseUp.bind(this));
  }

  init() {
    this.model.init();
    console.log('hi!');
  }

  async handlerClickStartGame() {
    this.view.hideStartPage();
    this.view.showLouder();
    await this.model.initGame();
    setTimeout(() => {
      this.view.hideLouder();
      this.view.showFillWord();
      this.gameStart();
    }, 3000);
  }

  gameStart() {
    this.model.wordsService.updateRepetition(this.model.gameWord.id, this.difficultGroup);
    this.view.addWordTranslateText(this.model.gameWord.ru);
    this.model.initGameField();
    this.view.renderField(this.model.field, this.mouseMoveHandler.bind(this), this.mouseDownHandler.bind(this));
  }

  isUserRightHandler() {
    setTimeout(() => {
      this.model.gameRound += 1;
      this.model.wordsService.updateKnowledge(this.model.gameWord.id, this.difficultGroup);
      this.model.isCorrectAnswer();
      if (this.model.gameRound === this.model.gameWords.length) {
        this.view.showStatistics(this.model.arrayAnswer);
        return;
      }
      this.model.getWord();
      this.view.deleteOldGameTable();
      this.coordinate = [];
      this.model.initGameField();
      this.view.addWordTranslateText(this.model.gameWord.ru);
      this.view.renderField(this.field, this.mouseMoveHandler.bind(this), this.mouseDownHandler.bind(this));
    }, 1000);
  }

  handlerClickRefresh() {
    this.view.deleteOldGameTable();
    this.model.innerArrWord = [];
    this.model.initGameField();
    this.view.renderField(this.model.field, this.mouseMoveHandler.bind(this), this.mouseDownHandler.bind(this));
  }

  handlerClickHelp() {
    console.log('help');
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

  handlerMouseUp() {
    this.isMouseDown = false;
    if (this.isUserRight) {
      this.view.innerTextLocalResult('верно');
      this.isUserRightHandler();
    } else {
      this.view.innerTextLocalResult('неверно');
    }
    this.model.addAnswerResult();
    this.isUserRight = false;
    this.model.chooseCoordinate = [];
    this.view.innerTextLocalResult('');
    this.view.clearChooseWordContainer();
    View.removeSelectCell();
  }

  mouseMoveHandler(event) {
    if (this.isMouseDown) {
      event.currentTarget.classList.add('select');
    }

    if (this.model.innerArrWord.length !== 0
      && this.model.innerArrWord[this.model.innerArrWord.length - 1] !== event.currentTarget.innerText
      && this.isMouseDown) {
      this.model.innerArrWord.push(event.currentTarget.innerText);
      this.view.innerWord.innerText = this.model.innerArrWord.join('');
      return;
    }

    if (!this.isMouseDown || !this.isUserRight) {
      return;
    }

    const currentCord = readCoordsFromAttribute(event.target);

    if (this.model.chooseCoordinate.length !== 0
      && this.model.chooseCoordinate[this.model.chooseCoordinate.length - 1][0] === currentCord[0]
      && this.model.chooseCoordinate[this.model.chooseCoordinate.length - 1][1] === currentCord[1]) {
      return;
    }

    this.isUserRight = this.model.coordinate.length > this.model.chooseCoordinate.length
      && this.model.coordinate[this.model.chooseCoordinate.length][0] === currentCord[0]
      && this.model.coordinate[this.model.chooseCoordinate.length][1] === currentCord[1];

    if (this.isUserRight) {
      this.model.chooseCoordinate.push(currentCord);
    }
  }

  mouseDownHandler(event) {
    this.isMouseDown = true;

    const currentCord = readCoordsFromAttribute(event.currentTarget);

    this.isUserRight = !!currentCord
      && this.model.coordinate[0][0] === currentCord[0]
      && this.model.coordinate[0][1] === currentCord[1];

    if (this.isUserRight) {
      this.model.chooseCoordinate.push(currentCord);
    }
    this.model.innerArrWord.push(event.currentTarget.innerText);
    this.view.innerWord.innerText = this.model.innerArrWord.join('');
  }
}

const model = new Model();
const view = new View();
const controller = new Controller(model, view);
controller.init();

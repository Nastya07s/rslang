/* eslint-disable linebreak-style */
/* eslint-disable prefer-destructuring */
import './scss/main.scss';
/* import api from '../../js/api'; */
import startPage from './js/startPage/startPage';
import createField from './js/mainPage/mainPage';
/* import Settings from '../../js/settings'; */

let arrayWord = [];
async function getData() {
  const data = await startPage.getDefaultWords();
  arrayWord = data;
  return arrayWord;
}
getData();

let coordinate = [];
let chooseCoordinate = [];
let isMouseDown = false;
let isUserRight = false;
let innerArrWord = [];
let keyWord = [];
let keyWordTranslate = [];
let field = [];
let counterWord = 0;
const containerStartPage = document.getElementById('start-page');
const containerFillWord = document.getElementById('fillWord');
const innerWord = document.getElementById('keyword');
const table = document.getElementById('gameTable');
const buttonRefresh = document.getElementById('refresh');
const buttonHelp = document.getElementById('help');
const wordTranslate = document.getElementById('translate');
const btnGameStart = document.getElementById('button-game-start');

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

const mouseMoveHandler = (event) => {
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
};

function renderField(newField) {
  for (let i = 0; i < newField.length; i += 1) {
    const tr = document.createElement('tr');

    for (let j = 0; j < newField[i].length; j += 1) {
      const td = document.createElement('td');
      td.innerText = newField[i][j];
      td.setAttribute('data-coordinate', `${i}_${j}`);

      td.addEventListener('mousemove', mouseMoveHandler);
      td.addEventListener('mousedown', mouseDownHandler);

      tr.append(td);
    }

    table.append(tr);
  }
  wordTranslate.innerText = `"${keyWordTranslate}"`;
}

function deleteOldGameField() {
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
}

function clearGameField() {
  innerWord.innerText = '';
  innerArrWord = [];
}

function refreshButtonHandler() {
  deleteOldGameField();
  clearGameField();
  field = createField(keyWord, 5, 6, coordinate);
  renderField(field);
}

function gameStartButtonHandler() {
  keyWordTranslate = arrayWord[0].ru;
  keyWord = arrayWord[0].en;
  field = createField(keyWord, 5, 6, coordinate);
  renderField(field);
  containerFillWord.classList.toggle('display-off');
  containerStartPage.classList.toggle('display-off');
}

function isUserRightHandler() {
  counterWord += 1;
  keyWordTranslate = arrayWord[counterWord].ru;
  keyWord = arrayWord[counterWord].en;

  deleteOldGameField();
  clearGameField();
  coordinate = [];
  chooseCoordinate = [];

  field = createField(keyWord, 5, 6, coordinate);
  renderField(field);
  console.log('word found');
}

function isUserFalseHandler() {
  chooseCoordinate = [];
  clearGameField();
  console.log('word not found');
}

const mouseUpHandler = () => {
  isMouseDown = false;
  if (isUserRight) {
    isUserRightHandler();
  } else {
    isUserFalseHandler();
  }
  isUserRight = false;
  const cell = document.querySelectorAll('td');
  cell.forEach((e) => {
    e.classList.remove('select');
  });
};

const helpButtonHandler = () => {
  console.log('help');
};

table.addEventListener('mouseup', mouseUpHandler);

buttonRefresh.addEventListener('click', refreshButtonHandler);

btnGameStart.addEventListener('click', gameStartButtonHandler);

buttonHelp.addEventListener('click', helpButtonHandler);

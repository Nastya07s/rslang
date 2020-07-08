/* eslint-disable linebreak-style */
/* eslint-disable prefer-destructuring */
import './scss/main.scss';
/* import api from '../../js/api'; */
/* import startPage from './js/startPage/startPage'; */
/* import Settings from '../../js/settings'; */

let coordinate = [];
let chooseCoordinate = [];
let isMouseDown = false;
let isUserRight = false;
let innerArrWord = [];
const keyWord = 'assasin';
const keyWordTranslate = 'убийца';
const containerStartPage = document.getElementById('start-page');
const containerFillWord = document.getElementById('fillWord');
const innerWord = document.getElementById('keyword');
const table = document.getElementById('gameTable');
const buttonRefresh = document.getElementById('refresh');
const wordTranslate = document.getElementById('translate');
const btnGameStart = document.getElementById('button-game-start');
/* const settings = new Settings(); */

/* const data = async () => {
  await startPage.getDefaultWords();
}; */

wordTranslate.innerText = `"${keyWordTranslate}"`;

function checkCoordinate(x, y, width, height, checkField) {
  return (x > 0 && x < width && y > 0 && y < height && checkField[y][x] === '0');
}

function createNextCoordinates(x, y, width, height, checkField) {
  const result = [];

  if (checkCoordinate(x - 1, y, width, height, checkField)) {
    result.push([x - 1, y]);
  }

  if (checkCoordinate(x + 1, y, width, height, checkField)) {
    result.push([x + 1, y]);
  }

  if (checkCoordinate(x, y - 1, width, height, checkField)) {
    result.push([x, y - 1]);
  }

  if (checkCoordinate(x, y + 1, width, height, checkField)) {
    result.push([x, y + 1]);
  }

  return result;
}

function getRandomArbitrary(min, max) {
  return Math.ceil(Math.random() * (max - min) + min);
}

function getRandomEnglishSymbol() {
  return String.fromCharCode(getRandomArbitrary(97, 122));
}

function createZeroField(width, height) {
  const result = [];
  for (let i = 0; i < height; i += 1) {
    const row = [];
    for (let j = 0; j < width; j += 1) {
      row.push('0');
    }
    result.push(row);
  }
  return result;
}

function createField(hiddenWord, width, height) {
  if (width * height < hiddenWord.length) {
    return null;
  }

  const result = createZeroField(width, height);
  let x = getRandomArbitrary(0, width - 1);
  let y = getRandomArbitrary(0, height - 1);

  coordinate.push([y, x]);
  result[y][x] = hiddenWord[0];

  for (let i = 1; i < hiddenWord.length; i += 1) {
    const possibleCoordinates = createNextCoordinates(x, y, width, height, result);
    const nextPoint = getRandomArbitrary(0, possibleCoordinates.length - 1);

    x = possibleCoordinates[nextPoint][0];
    y = possibleCoordinates[nextPoint][1];
    result[y][x] = hiddenWord[i];
    coordinate.push([y, x]);
  }

  for (let i = 0; i < height; i += 1) {
    for (let j = 0; j < width; j += 1) {
      if (result[i][j] === '0') {
        result[i][j] = getRandomEnglishSymbol();
      }
    }
  }

  return result;
}

const field = createField(keyWord, 5, 6);

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

  innerArrWord.push(event.currentTarget.innerText);
  innerWord.innerText = innerArrWord.join('');
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
}

function refreshButtonHandle() {
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }

  innerWord.innerText = '';
  coordinate = [];
  innerArrWord = [];
  const newField = createField(keyWord, 5, 6);

  renderField(newField);
}

function gameStart() {
  containerFillWord.classList.toggle('display-off');
  containerStartPage.classList.toggle('display-off');
}

table.addEventListener('mouseup', () => {
  isMouseDown = false;

  console.log(isUserRight ? 'word found' : ' word not found');

  chooseCoordinate = [];
  isUserRight = false;
  const cell = document.querySelectorAll('td');
  cell.forEach((e) => {
    e.classList.remove('select');
  });
});

buttonRefresh.addEventListener('click', refreshButtonHandle);

btnGameStart.addEventListener('click', gameStart);

renderField(field);

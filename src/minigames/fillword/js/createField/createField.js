/* eslint-disable prefer-destructuring */

import getRandomArbitrary from '../helpers/getRandomArbitrary';

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

function createField(hiddenWord, width, height, coordinate) {
  if (width * height < hiddenWord.length && !hiddenWord) {
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

export default createField;

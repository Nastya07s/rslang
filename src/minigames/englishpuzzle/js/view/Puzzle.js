import eventEmitter from '../servises/eventEmitter';

export default class Puzzle {
  constructor() {
    this.movedWord = null;
    this.insertBefore = null;
    this.searchElements();
    this.setListeners();
  }

  searchElements() {
    this.phraseBox = document.querySelector('.boxes');
    this.puzzle = document.querySelectorAll('.word');
  }

  setListeners() {
    this.phraseBox.addEventListener('drop', () => {
      eventEmitter.emit('droped', { word: this.movedWord, target: this.insertBefore });
      this.movedWord = null;
      this.insertBefore = null;
    });
    this.phraseBox.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
  }

  setCorrectMask(mask) {
    this.puzzle = document.querySelectorAll('.word');
    this.puzzle.forEach((el, i) => {
      if (mask[i]) {
        el.classList.add('correct');
      } else {
        el.classList.add('incorrect');
      }
    });
  }

  createPuzzleElement({ word, id }) {
    const boxWord = document.createElement('span');
    boxWord.classList.add('word');
    boxWord.setAttribute('draggable', 'true');
    boxWord.setAttribute('data-id', id);
    boxWord.innerText = word;
    boxWord.addEventListener('dragstart', (e) => {
      this.movedWord = e.target.getAttribute('data-id');
      boxWord.classList.add('dragging');
    });
    boxWord.addEventListener('dragover', (e) => {
      this.insertBefore = e.target.getAttribute('data-id');
      e.preventDefault();
      boxWord.classList.remove('dragging');
    });
    boxWord.addEventListener('dblclick', (e) => {
      eventEmitter.emit('droped', { word: e.target.getAttribute('data-id'), target: null });
    });
    return boxWord;
  }

  drawPuzzle(selector, arrPhrase) {
    const wordsBox = document.querySelector(selector);
    wordsBox.innerHTML = '';
    arrPhrase.forEach((el) => {
      wordsBox.appendChild(this.createPuzzleElement(el));
    });
  }

  reDrawPuzzle(inArr, outArr) {
    this.drawPuzzle('.words', inArr);
    this.drawPuzzle('.boxes', outArr);
  }
}

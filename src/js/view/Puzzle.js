import EventMixin from '../mixins/eventMixin';

class Puzzle {
  constructor() {
    this.movedWord = null;
    this.insertBefore = null;
    this.$phraseBox = document.querySelector('.boxes');
    this.$phraseBox.addEventListener('drop', () => {
      this.emit('droped', { word: this.movedWord, target: this.insertBefore });
      this.movedWord = null;
      this.insertBefore = null;
    });
    this.$phraseBox.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
  }

  // eslint-disable-next-line class-methods-use-this
  createPuzzleElement({ word, id }) {
    const $boxWord = document.createElement('span');
    $boxWord.classList.add('word');
    $boxWord.setAttribute('draggable', 'true');
    $boxWord.setAttribute('data-id', id);
    $boxWord.innerText = word;
    $boxWord.addEventListener('dragstart', (e) => {
      this.movedWord = e.target.getAttribute('data-id');
      $boxWord.classList.add('dragging');
    });
    $boxWord.addEventListener('dragover', (e) => {
      this.insertBefore = e.target.getAttribute('data-id');
      e.preventDefault();
      $boxWord.classList.remove('dragging');
    });
    $boxWord.addEventListener('dblclick', (e) => {
      this.emit('droped', { word: e.target.getAttribute('data-id'), target: null });
    });
    return $boxWord;
  }

  drawPuzzle(selector, arrPhrase) {
    const $wordsBox = document.querySelector(selector);
    $wordsBox.innerHTML = '';
    arrPhrase.forEach((el) => {
      $wordsBox.appendChild(this.createPuzzleElement(el));
    });
  }

  reDrawPuzzle(inArr, outArr) {
    this.drawPuzzle('.words', inArr);
    this.drawPuzzle('.boxes', outArr);
  }
}

Object.assign(Puzzle.prototype, EventMixin);
export default Puzzle;

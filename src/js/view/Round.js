import Puzzle from './Puzzle';

class Round {
  constructor() {
    this.puzzle = new Puzzle();
  }

  initRound(data) {
    this.drawWord(data.word, data.transcript);
    this.drawTranslation(data.translation);
    this.drawEnPhrase(data.englishPhrase);
    this.drawRuPhrase(data.russianPhrase);
    this.puzzle.reDrawPuzzle(data.words, []);
  }

  // eslint-disable-next-line class-methods-use-this
  switchLoader() {
    const $loader = document.querySelector('.loader');
    const style = $loader.style.display;
    $loader.style.display = style === 'none' ? 'flex' : 'none';
  }

  // eslint-disable-next-line class-methods-use-this
  setText(selector, content) {
    const $elem = document.querySelector(selector);
    $elem.innerText = content;
  }

  drawWord(word, transcript) {
    this.setText('#transcript', (word, transcript));
  }

  drawTranslation(word) {
    this.setText('#translation', word);
  }

  drawEnPhrase(phrase) {
    this.setText('.data-translate', phrase);
  }

  drawRuPhrase(phrase) {
    this.setText('.english-translate', phrase);
  }
}

export default Round;

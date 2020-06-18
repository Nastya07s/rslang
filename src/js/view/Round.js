
import EventMixin from '../mixins/eventMixin';

class Round {
  constructor(puzzle, state) {
    this.state = state;
    this.puzzle = puzzle;
    this.puzzle.on('droped', (e) => { this.emit('droped', e); });

    this.checkButton = document.querySelector('.check');
    this.checkButton.addEventListener('click', () => {
      this.emit('check');
    });

    this.dontKnowButton = document.querySelector('.i-dont-know');
    this.dontKnowButton.addEventListener('click', () => {
      this.emit('dont-know');
    });

    this.state.on('wordLoaded', this.initRound.bind(this));
  }

  initRound(data) {
    this.drawWord(data.word);
    this.drawTranscript(data.transcript);
    this.drawTranslation(data.translation);
    this.drawEnPhrase(data.englishPhrase);
    this.drawRuPhrase(data.russianPhrase);
    this.puzzleReload(data.words, []);
  }

  puzzleReload(inArr, outArr) {
    this.puzzle.reDrawPuzzle(inArr, outArr);
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

  drawWord(word) {
    this.setText('#transcript', word);
  }

  drawTranscript(word) {
    this.setText('#transcript-2', word);
  }

  drawTranslation(word) {
    this.setText('#translation', word);
  }

  drawEnPhrase(phrase) {
    this.setText('.english-translate', phrase);
  }

  drawRuPhrase(phrase) {
    this.setText('.data-translate', phrase);
  }
}

Object.assign(Round.prototype, EventMixin);
export default Round;

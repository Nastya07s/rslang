
import EventMixin from '../mixins/eventMixin';
import dataVectors from '../background/data-vectors';

class Round {
  constructor(puzzle, state) {
    this.state = state;
    this.puzzle = puzzle;
    this.puzzle.on('droped', (e) => { this.emit('droped', e); });

    this.englishPhrase = document.querySelector('.english-translate');

    this.container = document.querySelector('.levels');

    this.spinner = document.querySelector('.loader__box');

    this.progressBar = document.querySelector('.progress-value');
    this.progressBarNumber = document.querySelector('.start-round');

    this.roundNumber = document.querySelector('.number-round');
    this.groupNumber = document.querySelector('.number-level');

    this.checkButton = document.querySelector('.check');
    this.checkButton.addEventListener('click', () => {
      this.emit('check');
    });

    this.dontKnowButton = document.querySelector('.i-dont-know');
    this.dontKnowButton.addEventListener('click', () => {
      this.emit('dontKnow');
    });

    this.state.on('setRound', this.drawCurrentInfo.bind(this));

    this.state.on('wordLoaded', this.initRound.bind(this));

    this.state.on('changeImage', this.setRoundBg.bind(this));

    this.transcript = document.querySelector('#transcript');
    this.transcript.addEventListener('click', () => {
      this.emit('sayWord');
    });

    this.sayWordBtn = document.querySelector('.btn-sound');
    this.sayWordBtn.addEventListener('click', () => {
      this.emit('sayWord');
    });

    this.sayPhraseBtn = document.querySelector('.btn-play');
    this.sayPhraseBtn.addEventListener('click', () => {
      this.emit('sayPhrase');
    });
  }

  spinnerOn() {
    this.spinner.style.display = 'flex';
  }

  spinnerOff() {
    this.spinner.style.display = 'none';
  }

  initRound(data) {
    this.hideTranslate();
    this.drawWord(data.word);
    this.drawTranscript(data.transcript);
    this.drawTranslation(data.translation);
    this.drawEnPhrase(data.englishPhrase);
    this.drawRuPhrase(data.russianPhrase);
    this.puzzleReload(data.words, []);
    this.spinnerOff();
  }

  drawCurrentInfo(info) {
    this.progressBar.style.width = `${Number(info.word) * 5}%`;
    this.progressBarNumber.innerText = Number(info.word) + 1;
    this.roundNumber.innerText = Number(info.round) + 1;
    this.groupNumber.innerText = Number(info.group) + 1;
  }

  puzzleReload(inArr, outArr) {
    this.puzzle.reDrawPuzzle(inArr, outArr);
  }

  setRoundBg() {
    const max = dataVectors.length;
    const random = Math.floor(Math.random() * max - 1);
    if (dataVectors === undefined || dataVectors === null) {
      console.log('image undefined');
      this.container.style.background = `linear-gradient(rgba(8, 15, 26, 0.39) 0%, rgba(17, 17, 46, 0.46) 100%) center center / cover fixed,
    url('/assets/img/default.svg')center center / cover fixed`;
    }
    this.container.style.background = `linear-gradient(rgba(8, 15, 26, 0.39) 0%, rgba(17, 17, 46, 0.46) 100%) center center / cover fixed,
    url(${dataVectors[random].image})center center / cover fixed`;
  }

  // eslint-disable-next-line class-methods-use-this
  switchLoader() {
    const $loader = document.querySelector('.loader');
    const style = $loader.style.display;
    $loader.style.display = style === 'none' ? 'flex' : 'none';
  }

  setCorrectMask(mask) {
    this.puzzle.setCorrectMask(mask);
  }

  // eslint-disable-next-line class-methods-use-this
  setText(selector, content) {
    const $elem = document.querySelector(selector);
    $elem.classList.add('tracking-in-expand');
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

  showTranslate() {
    this.englishPhrase.classList.add('tracking-in-expand-fwd');
  }

  hideTranslate() {
    this.englishPhrase.classList.remove('tracking-in-expand-fwd');
  }
}

Object.assign(Round.prototype, EventMixin);
export default Round;

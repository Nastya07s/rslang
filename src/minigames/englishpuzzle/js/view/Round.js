import state from '../state';
import Puzzle from './Puzzle';
import eventEmitter from '../servises/eventEmitter';
import dataVectors from '../background/data-vectors';

const helper = {
  setText(selector, content) {
    const elem = document.querySelector(selector);
    elem.innerText = content;
  },

  drawWord(word) {
    this.setText('#transcript', word);
  },

  drawTranscript(word) {
    this.setText('#transcript-2', word);
  },

  drawTranslation(word) {
    this.setText('#translation', word);
  },

  drawEnPhrase(phrase) {
    this.setText('.english-translate', phrase);
  },

  drawRuPhrase(phrase) {
    this.setText('.data-translate', phrase);
  },

  fadeIn(nodeCopy, duration) {
    const node = nodeCopy;
    if (getComputedStyle(node).display !== 'none') return;
    if (node.style.display === 'none') {
      node.style.display = '';
    } else {
      node.style.display = 'block';
    }
    node.style.opacity = 0;
    const start = performance.now();
    requestAnimationFrame(function tick(timestamp) {
      const easing = (timestamp - start) / duration;
      node.style.opacity = Math.min(easing, 1);
      if (easing < 1) {
        requestAnimationFrame(tick);
      } else {
        node.style.opacity = '';
      }
    });
  },

  fadeOut(node, duration) {
    const nodeCopy = node;
    nodeCopy.style.opacity = 1;
    const start = performance.now();

    requestAnimationFrame(function tick(timestamp) {
      const easing = (timestamp - start) / duration;
      nodeCopy.style.opacity = Math.max(1 - easing, 0);
      if (easing < 1) {
        requestAnimationFrame(tick);
      } else {
        nodeCopy.style.opacity = '';
        nodeCopy.style.display = 'none';
      }
    });
  },
};

export default class Round {
  constructor() {
    this.state = state;
    this.puzzle = new Puzzle();
    this.audio = new Audio();
    this.searchElements();
    this.setListeners();
    this.setRoundBg();
  }

  searchElements() {
    this.modal = document.querySelector('.start-wrapper');
    this.close = document.querySelector('.game-start__start');
    this.wrap = document.querySelector('.wrapper');
    this.englishPhrase = document.querySelector('.english-translate');
    this.container = document.querySelector('.levels');
    this.spinner = document.querySelector('.loader__box');
    this.progressBar = document.querySelector('.progress-value');
    this.progressBarNumber = document.querySelector('.start-round');
    this.roundNumber = document.querySelector('.number-round');
    this.groupNumber = document.querySelector('.number-level');
    this.checkButton = document.querySelector('.check');
    this.dontKnowButton = document.querySelector('.i-dont-know');
    this.transcript = document.querySelector('#transcript');
    this.sayWordBtn = document.querySelector('.btn-sound');
    this.sayPhraseBtn = document.querySelector('.btn-play');
    this.loader = document.querySelector('.loader');
    this.settingsForm = document.querySelector('.options__settings');
  }

  settingsFormOn() {
    this.settingsForm.style.display = 'flex';
  }

  settingsFormOff() {
    this.settingsForm.style.display = 'none';
  }

  setListeners() {
    // this.puzzle.on('droped', (e) => { eventEmitter.emit('droped', e); });
    // this.checkButton.addEventListener('click', () => {
    //   eventEmitter.emit('check');
    // });
    this.dontKnowButton.addEventListener('click', () => {
      eventEmitter.emit('dontKnow');
    });
    eventEmitter.on('changeRound', this.drawCurrentInfo.bind(this));
    eventEmitter.on('changeWord', this.initRound.bind(this));
    eventEmitter.on('changeImage', this.setRoundBg.bind(this));
    this.transcript.addEventListener('click', () => {
      eventEmitter.emit('sayWord');
    });
    this.sayWordBtn.addEventListener('click', () => {
      eventEmitter.emit('sayWord');
    });
    this.sayPhraseBtn.addEventListener('click', () => {
      eventEmitter.emit('sayPhrase');
    });
    this.close.addEventListener('click', () => {
      eventEmitter.emit('userStart');
    });
  }

  closeStartScreen() {
    helper.fadeOut(this.modal, 200);
    helper.fadeIn(this.modal, 600);
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

  spinnerOn() {
    this.spinner.style.display = 'flex';
  }

  spinnerOff() {
    this.spinner.style.display = 'none';
  }

  drawCurrentInfo(info) {
    this.progressBar.style.width = `${Number(info.word) * 5}%`;
    this.progressBarNumber.innerText = Number(info.word) + 1;
    this.roundNumber.innerText = Number(info.round) + 1;
    this.groupNumber.innerText = Number(info.group) + 1;
    this.playWord('/assets/audio/points.wav');
  }

  playWord(src) {
    this.audio.preload = 'auto';
    this.audio.src = src;
    this.audio.play();
  }

  puzzleReload(inArr, outArr) {
    this.puzzle.reDrawPuzzle(inArr, outArr);
  }

  setRoundBg() {
    const max = dataVectors.length;
    const random = Math.floor(Math.random() * max - 1);
    if (dataVectors === undefined || dataVectors === null) {
      console.log('image undefined');
      this.container.style.background = `linear-gradient(rgba(8, 15, 26, 0.39) 0%,rgba(17, 17, 46, 0.46)100%) center center/cover fixed,
        url('/assets/img/default.svg')center center / cover fixed`;
    }
    this.container.style.background = `linear-gradient(rgba(8, 15, 26, 0.39)0%,rgba(17, 17, 46, 0.46) 100%) center center/cover fixed,
        url(${dataVectors[random].image})center center / cover fixed`;
  }

  switchLoader() {
    const style = this.loader.style.display;
    this.loader.style.display = style === 'none' ? 'flex' : 'none';
  }

  setCorrectMask(mask) {
    this.puzzle.setCorrectMask(mask);
  }

  showTranslate() {
    this.englishPhrase.classList.add('tracking-in-expand-fwd');
  }

  hideTranslate() {
    this.englishPhrase.classList.remove('tracking-in-expand-fwd');
  }
}

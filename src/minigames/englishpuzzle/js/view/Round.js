import state from '../state';
import Puzzle from './Puzzle';
import eventEmitter from '../services/eventEmitter';
import dataVectors from '../background/data-vectors';
import helpers from './helpers';

export default class Round {
  constructor() {
    this.state = state;
    this.puzzle = new Puzzle();
    this.audio = new Audio();
    this.event = eventEmitter;
    this.searchElements();
    this.setListeners();
    this.setRoundBg();
  }

  searchElements() {
    this.main = document.querySelector('.levels');
    this.modal = document.querySelector('.start-wrapper');
    this.close = document.querySelector('.game-start__start');
    this.wrap = document.querySelector('.wrapper');
    this.englishPhrase = document.querySelector('.english-translate');
    this.container = document.querySelector('.levels');
    this.spinner = document.querySelector('.loader__box');
    this.progressBar = document.querySelector('.progress-value');
    this.progressBarNumber = document.querySelector('.start-round');
    this.progressBarNumberLength = document.querySelector('.end-round');
    this.checkButton = document.querySelector('.check');
    this.dontKnowButton = document.querySelector('.i-dont-know');
    this.transcript = document.querySelector('#transcript');
    this.sayWordBtn = document.querySelector('.btn-sound');
    this.sayPhraseBtn = document.querySelector('.btn-play');
    this.loader = document.querySelector('.loader');
    this.exitBtn = document.querySelector('.exit-svg');
    this.closeBtn = document.querySelector('.close');
    this.groupSelector = document.querySelector('.stars');
    this.levelselector = document.querySelector('#levelselector');

    this.settingsForm = document.querySelector('.options');
    this.buttonOptionsSettings = document.querySelector('.options__settings');

    this.roundLimit = this.state.store.settings.roundLimit.quantityStep + 1;
  }

  setListeners() {
    this.checkButton.addEventListener('click', () => {
      this.event.emit('check');
    });
    this.dontKnowButton.addEventListener('click', () => {
      this.event.emit('dontKnow');
    });
    this.event.on('changeStep', this.drawCurrentInfo.bind(this));
    this.event.on('changeWord', this.initRound.bind(this));
    this.event.on('changeImage', this.setRoundBg.bind(this));
    this.transcript.addEventListener('click', () => {
      this.event.emit('sayWord');
    });
    this.sayWordBtn.addEventListener('click', () => {
      this.event.emit('sayWord');
    });
    this.sayPhraseBtn.addEventListener('click', () => {
      this.event.emit('sayPhrase');
    });
    this.close.addEventListener('click', () => {
      this.event.emit('userStart');
    });
    this.exitBtn.addEventListener('click', () => {
      const el = document.querySelector('#Capa_1');
      if (this.exitBtn.contains(el)) {
        helpers.fadeOut(this.main, 800);
        this.event.emit('goHome');
      }
    });
    this.closeBtn.addEventListener('click', () => {
      this.event.emit('goHome');
    });
    this.groupSelector.addEventListener('click', (e) => {
      if (e.target.classList.contains('star')) {
        const group = e.target.getAttribute('data-group');
        this.event.emit('userSetGroup', group);
      }
    });
    this.levelselector.addEventListener('input', () => {
      this.event.emit('userSetRound', this.levelselector.value);
    });
  }

  settingsFormOn() {
    this.settingsForm.classList.remove('closed-settings');
    this.settingsForm.parentNode.addEventListener('click', (event) => {
      if (event.target.classList.contains('options')) {
        this.buttonOptionsSettings.classList.toggle('message-settings-closed');
        this.buttonOptionsSettings.classList.toggle('scale-in-center');
      }
    });
  }

  settingsFormOff() {
    this.settingsForm.classList.add('closed-settings');
  }

  closeStartScreen() {
    helpers.fadeOut(this.modal, 800);
  }

  initRound(data) {
    this.hideTranslate();
    helpers.drawWord(data.word);
    helpers.drawTranscript(data.transcript);
    helpers.drawTranslation(data.translation);
    helpers.drawEnPhrase(data.englishPhrase);
    helpers.drawRuPhrase(data.russianPhrase);
    this.puzzleReload(data.words, []);
    this.spinnerOff();
    this.progressBarNumberLength.innerText = this.roundLimit;
  }

  spinnerOn() {
    this.spinner.style.display = 'flex';
  }

  spinnerOff() {
    this.spinner.style.display = 'none';
  }

  drawCurrentInfo(info) {
    this.progressBar.style.width = `${Number(info.step) * 5}%`;
    this.progressBarNumber.innerText = Number(info.step) + 1;
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

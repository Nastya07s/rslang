import Round from './js/view/Round';
import Puzzle from './js/view/Puzzle';
import Model from './js/model/Model';
import Words from './js/model/Words';
import state from './js/state/state';
import Statistic from './js/model/Statistic';
import QuickStatistic from './js/view/QuickStatistic';

class EnglishPuzzle {
  constructor(api) {
    this.round = new Round(new Puzzle(), state);
    this.model = new Model(new Words(api), new Statistic(api), state);
    this.quickStat = new QuickStatistic();

    state.on('gameOver', () => {
      window.location.href = '/';
    });

    this.quickStat.on('closeStat', this.nextWord.bind(this));


    this.round.on('droped', this.onDropped.bind(this));
    this.round.on('dontKnow', this.onDontKnow.bind(this));
    this.round.on('check', this.onCheck.bind(this));

    this.round.on('sayWord', (() => {
      new Audio(state.getAudioWord()).play();
    }));
    this.round.on('sayPhrase', (() => {
      new Audio(state.getAudioPhrase()).play();
    }));

    this.model.setGameMode('auto');
    state.setRoundInfo(0, 0, 0);

    this.modal = document.querySelector('.start-wrapper');
    this.close = document.querySelector('.game-start__start');

    this.wrap = document.querySelector('.wrapper');

    this.close.addEventListener('click', () => {
      this.fadeOut(this.modal, 200);
      this.fadeIn(this.modal, 600);
    });

    this.settingsIcon = document.querySelector('.options');

    // this.model.on('repeatMode', (() => {
    //   this.settingsIcon.display = 'none';
    // }));

    this.init();
  }

  // eslint-disable-next-line class-methods-use-this
  init() {
    state.isDontKnow = false;
    state.isChecked = false;
    // this.model.setRoundData();
  }

  // eslint-disable-next-line class-methods-use-this
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
  }

  // eslint-disable-next-line class-methods-use-this
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
  }

  onDontKnow() {
    this.round.showTranslate();
    state.isDontKnow = true;
  }

  onCheck() {
    if (state.getOriginWords().length === 0) {
      const expectedArr = state.getEnPhrase().split(' ');
      const correctMask = [];

      state.getMovedWords().forEach((word, i) => {
        correctMask.push(word.word === expectedArr[i]);
      });
      this.round.setCorrectMask(correctMask);

      const isCorrect = correctMask.reduce((acc, el) => acc && el, true);

      if (!state.isChecked) {
        this.model.setStatistic(
          state.getWord(),
          isCorrect && !state.isDontKnow,
        );
        state.isChecked = true;
      }
      if (isCorrect) {
        const { word } = state.getRoundInfo();
        if (Number(word) === state.store.settings.quantityWord - 1) {
          setTimeout(this.quickStat.show(this.model.statistic.data), 2000);
        } else {
          setTimeout(this.nextWord.bind(this), 2000);
        }
      }
    }
  }

  nextWord() {
    state.nextWord();
    this.init();
    this.model.setRoundData();
    this.round.spinnerOn();
  }

  onDropped(e) {
    const droppedWord = state.extractPuzzleWord(Number(e.word));
    state.dropPuzzleWord(droppedWord, Number(e.target));
    this.round.puzzleReload(state.getOriginWords(), state.getMovedWords());
  }
}

export default EnglishPuzzle;

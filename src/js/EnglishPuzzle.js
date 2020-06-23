import Round from './view/Round';
import Puzzle from './view/Puzzle';
import Model from './model/Model';
import Words from './model/Words';
import state from './state/state';
import Statistic from './model/Statistic';
import QuickStatistic from './view/QuickStatistic';

class EnglishPuzzle {
  constructor(api) {
    this.round = new Round(new Puzzle(), state);
    this.model = new Model(new Words(api), new Statistic(api), state);
    this.quickStat = new QuickStatistic();

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

    state.setRoundInfo(0, 0, 19);

    this.init();
  }

  init() {
    state.isDontKnow = false;
    state.isChecked = false;
    this.model.setRoundData();
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
        if (Number(word) === 19) {
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
    this.round.spinnerOn();
  }

  onDropped(e) {
    const droppedWord = state.extractPuzzleWord(Number(e.word));
    state.dropPuzzleWord(droppedWord, Number(e.target));
    this.round.puzzleReload(state.getOriginWords(), state.getMovedWords());
  }
}

export default EnglishPuzzle;

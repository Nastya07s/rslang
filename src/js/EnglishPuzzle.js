import Round from './view/Round';
import Puzzle from './view/Puzzle';
import Model from './model/Model';
import Words from './model/Words';
import state from './state/state';
import Statistic from './model/Statistic';

class EnglishPuzzle {
  constructor(api) {
    this.round = new Round(new Puzzle(), state);
    this.model = new Model(new Words(api), new Statistic(api), state);

    this.round.on('droped', this.onDropped.bind(this));
    this.round.on('dontKnow', this.onDontKnow.bind(this));
    this.round.on('check', this.onCheck.bind(this));

    this.init();
  }

  init() {
    state.isDontKnow = false;
    state.isChecked = false;
    state.setRoundInfo(0, 0, 0);
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

      if (!state.isChecked) {
        this.model.setStatistic(
          state.getWord(),
          correctMask.reduce((acc, el) => acc && el, true) && !state.isDontKnow,
        );
        state.isChecked = true;
      }
    }
  }

  onDropped(e) {
    const droppedWord = state.extractPuzzleWord(Number(e.word));
    state.dropPuzzleWord(droppedWord, Number(e.target));
    this.round.puzzleReload(state.getOriginWords(), state.getMovedWords());
  }
}

export default EnglishPuzzle;

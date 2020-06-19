import Round from './view/Round';
import Puzzle from './view/Puzzle';
import Model from './model/Model';
import Words from './model/Words';
import state from './state/state';

class EnglishPuzzle {
  constructor(api) {
    this.round = new Round(new Puzzle(), state);
    this.model = new Model(new Words(api), state);

    this.round.on('droped', this.onDropped.bind(this));

    this.init();
  }

  init() {
    state.setRoundInfo(0, 0, 0);
    this.model.setRoundData();
  }

  onDropped(e) {
    const droppedWord = state.extractPuzzleWord(Number(e.word));
    state.dropPuzzleWord(droppedWord, Number(e.target));
    this.round.puzzleReload(state.getOriginWords(), state.getMovedWords());
  }
}

export default EnglishPuzzle;

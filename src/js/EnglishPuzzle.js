import Round from './view/Round';
import Puzzle from './view/Puzzle';
import Model from './model/Model';
import Words from './model/Words';
import state from './state/state';

class EnglishPuzzle {
  constructor(api) {
    this.round = new Round(new Puzzle(), state);
    this.model = new Model(new Words(api), state);
    this.init();
  }

  init() {
    state.setRoundInfo(0, 0, 0);
    this.model.setRoundData();
  }
}

export default EnglishPuzzle;

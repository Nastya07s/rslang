// import eventMixin from '../../../../englishpuzzle/js/mixins/eventMixin';

// const state = {

//   dropPuzzleWord(word, before) { // drop
//     if (before) {
//       const index = this.getMovedWords().indexOf(
//         this.getMovedWords().find((x) => x.id === before),
//       );
//       const updated = this.getMovedWords();
//       updated.splice(index, 0, word);
//       this.setMovedWords(updated);
//     } else {
//       this.setMovedWords([...this.getMovedWords(), word]);
//     }
//   },

//   extractPuzzleWord(id) {
//     let result = this.getOriginWords().find((word) => word.id === id);
//     if (result) {
//       this.setOriginWords(this.getOriginWords().filter((word) => word.id !== id));
//       return result;
//     }
//     result = this.getMovedWords().find((word) => word.id === id);
//     this.setMovedWords(this.getMovedWords().filter((word) => word.id !== id));
//     return result;
//   },

// };


// Object.assign(state, eventMixin);


// export default state;

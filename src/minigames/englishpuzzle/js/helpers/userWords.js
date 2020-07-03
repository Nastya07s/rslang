// /* eslint-disable no-use-before-define */

// const filterLearnedWords = (list) => list.filter(
//   (word) => {
//     if (!word.userWord && !word.userWord.optional) {
//       return false;
//     }
//     return word.userWord.optional.countRepetition < 4;
//   },
// );

const chunkArray = (myArray, chunkSize) => {
  const results = [];
  while (myArray.length) {
    results.push(myArray.splice(0, chunkSize));
  }

  return results;
};

const createRoundsList = (list) => {
  const roundsSize = 20;
  const groupSize = 30;
  if (list[0].paginatedResults.length <= roundsSize) {
    return [[[...list[0].paginatedResults]]];
  }
  const rounds = chunkArray(list[0].paginatedResults,
    Math.ceil(list[0].paginatedResults.length / roundsSize));
  return chunkArray(rounds, Math.ceil(rounds.length / groupSize));
};

export default createRoundsList; // filterLearnedWords,
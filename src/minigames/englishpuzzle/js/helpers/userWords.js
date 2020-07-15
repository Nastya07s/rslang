
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
  if (list.length <= roundsSize) {
    return [[[...list]]];
  }
  const rounds = chunkArray(list,
    Math.ceil(list.length / roundsSize));
  return chunkArray(rounds, Math.ceil(rounds.length / groupSize));
};

export default createRoundsList;

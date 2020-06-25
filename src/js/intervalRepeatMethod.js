const millisecondsPerSecond = 1000;
const timeToFirstRepeat = 10;
const timeToSecondRepeat = 1200;
const timeToThirdRepeat = 86400;
const timeToFourthRepeat = 1209600;
const timeToFifthRepeat = 5184000;

const checkReadyForRepetition = (countRepetition, lastRepetition) => {
  const today = new Date();
  const timePassedInSeconds = (today - lastRepetition) / millisecondsPerSecond;

  const isTimeForRepeat = (timeToRepeat) => timePassedInSeconds >= timeToRepeat;

  switch (countRepetition) {
    case '0': return isTimeForRepeat(timeToFirstRepeat);
    case '1': return isTimeForRepeat(timeToSecondRepeat);
    case '2': return isTimeForRepeat(timeToThirdRepeat);
    case '3': return isTimeForRepeat(timeToFourthRepeat);
    case '4': return isTimeForRepeat(timeToFifthRepeat);
    default: return false;
  }
};

export default checkReadyForRepetition;

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

  switch (String(countRepetition)) {
    case '0': return isTimeForRepeat(timeToFirstRepeat);
    case '1': return isTimeForRepeat(timeToSecondRepeat);
    case '2': return isTimeForRepeat(timeToThirdRepeat);
    case '3': return isTimeForRepeat(timeToFourthRepeat);
    case '4': return isTimeForRepeat(timeToFifthRepeat);
    default: return false;
  }
};

const nextRepetition = (countRepetition, lastRepetition) => {
  switch (String(countRepetition)) {
    case '0': return lastRepetition + timeToFirstRepeat * 1000;
    case '1': return lastRepetition + timeToSecondRepeat * 1000;
    case '2': return lastRepetition + timeToThirdRepeat * 1000;
    case '3': return lastRepetition + timeToFourthRepeat * 1000;
    case '4': return lastRepetition + timeToFifthRepeat * 1000;
    default: return '—';
  }
};

export { checkReadyForRepetition, nextRepetition };

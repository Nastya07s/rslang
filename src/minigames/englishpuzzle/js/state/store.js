export default {
  isReady: false,
  gameOver: false,
  settings: {
    learningMode: '',
    roundLimit: {
      quantityGroup: 6,
      quantityRound: 30,
      quantityStep: 20,
    },
  },
  roundInfo: { step: 0, round: 0, group: 0 },
  cache: {
    words: [],
  },
  word: {
    id: '',
    word: '',
    transcript: '',
    translation: '',
    englishPhrase: '',
    russianPhrase: '',
    enAudio: '',
    wordAudio: '',
    words: [],
    phrase: [],
    isDontKnow: false,
    isChecked: false,
  },
  quickStatistic: {
    correct: [],
    incorrect: [],
  },
};

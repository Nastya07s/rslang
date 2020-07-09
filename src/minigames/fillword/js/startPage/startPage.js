import api from '../../../../js/api';

class StartPage {
  constructor() {
    this.data = null;
    this.roundWords = [];
  }

  addRoundWords(data) {
    this.roundWords.push(
      {
        en: data.word,
        ru: data.wordTranslate,
      },
    );
    return this.roundWords;
  }

  async getDefaultWords() {
    this.data = await api.getWords(1, 0);
    this.data.forEach((el) => {
      this.addRoundWords(el);
    });
    return this.roundWords;
  }
}

const startPage = new StartPage();

export default startPage;

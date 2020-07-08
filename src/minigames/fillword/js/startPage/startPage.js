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
  }

  async getDefaultWords() {
    this.data = await api.getWords(0, 0);
    this.data.forEach((el) => {
      this.addRoundWords(el);
    });
    console.log(this.data);
    return this.data;
  }
}

const startPage = new StartPage();

export default startPage;

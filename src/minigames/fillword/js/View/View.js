import api from '../../../../js/api';

export default class View {
  constructor() {
    this.stars = document.querySelector('.stars');
    this.levels = document.querySelector('.options__levels');
    this.options = document.querySelector('.options');
    this.settingsMenu = document.querySelector('.options__settings');
    this.startPageContainer = document.getElementById('start-page');
    this.fillWordContainer = document.getElementById('fillWord');
    this.buttonStartGame = document.getElementById('button-game-start');
    this.buttonHelp = document.getElementById('help');
    this.buttonRefresh = document.getElementById('refresh');
    this.sound = document.querySelector('.audio');
    this.close = document.querySelector('.close');
    this.data = null;
    this.dataWithSetting = null;
    this.roundWords = [];
    this.mode = null;
    this.roundWordsWithSetting = [];
    this.chooseDifficultGroup = '';
    this.chooseWordPerPage = 0;
  }

  bindClickRefresh(handler) {
    this.buttonRefresh.addEventListener('click', () => {
      handler();
    });
  }

  bindClickHelp(handler) {
    this.buttonHelp.addEventListener('click', () => {
      handler();
    });
  }

  bindClickSound(handler) {
    this.sound.addEventListener('click', () => {
      this.sound.classList.toggle('audio_silence');
      handler();
    });
  }

  bindClickStartGame(handler) {
    this.buttonStartGame.addEventListener('click', () => {
      handler();
    });
  }

  bindDropOptions() {
    this.options.addEventListener('click', (e) => {
      if (e.target === this.options) {
        this.settingsMenu.classList.toggle('options__settings_inactive');
      }
    });
  }

  bindChangeLevel(handler) {
    this.levels.addEventListener('change', (e) => {
      handler(e.target.value);
    });
  }

  bindClickClose(handler) {
    this.close.addEventListener('click', () => {
      handler();
    });
  }

  bindChangeRound(handler) {
    this.stars.addEventListener('click', (e) => {
      const target = e.target.closest('.star');
      if (target) {
        this.showDifficulty(target.dataset.value);
        handler(target.dataset.value);
      }
    });
  }

  showDifficulty(count) {
    [...this.stars.children].forEach((element) => {
      element.classList.remove('active');
    });
    [...this.stars.children].forEach((element, index) => {
      if (index <= count) {
        element.classList.add('active');
      }
    });
  }

  addRoundWords(data) {
    if (this.roundWords.length < 5) {
      this.roundWords.push(
        {
          en: data.word,
          ru: data.wordTranslate,
        },
      );
    }
    return this.roundWords;
  }

  async getDefaultWords() {
    this.data = await api.getWords(1, 0);
    this.data.forEach((el) => {
      this.addRoundWords(el);
    });
    return this.roundWords;
  }

  addRoundWordsWithSetting(dataWithSetting) {
    this.roundWordsWithSetting.push(
      {
        en: dataWithSetting.word,
        ru: dataWithSetting.wordTranslate,
      },
    );
    return this.roundWordsWithSetting;
  }

  async initMixWords() {
    this.dataWithSetting = await api.getUsersAggregatedWords({
      group: 0,
      wordsPerPage: 3,
      filter: {
        $and: [
          { userWord: null },
        ],
      },
    });
    this.dataWithSetting[0].paginatedResults.forEach((el) => {
      this.addRoundWordsWithSetting(el);
    });
    return this.roundWordsWithSetting;
  }
}

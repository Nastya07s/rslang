import api from '../../../../js/api';
import createElementDOM from '../helpers/createElementDOM';

export default class View {
  constructor() {
    this.containerStartPage = document.getElementById('start-page');
    this.containerFillWord = document.getElementById('fillWord');
    this.chooseWordContainer = document.getElementById('keyword');
    this.table = document.getElementById('gameTable');
    this.wordTranslate = document.getElementById('translate');
    this.innerWord = document.getElementById('keyword');
    this.stars = document.querySelector('.stars');
    this.levels = document.querySelector('.options__levels');
    this.options = document.querySelector('.options');
    this.settingsMenu = document.querySelector('.options__settings');
    this.startPageContainer = document.getElementById('start-page');
    this.fillWordContainer = document.getElementById('fillWord');
    this.louderContainer = document.getElementById('louder');
    this.buttonStartGame = document.getElementById('button-game-start');
    this.buttonHelp = document.getElementById('help');
    this.buttonRefresh = document.getElementById('refresh');
    this.localResultContainer = document.getElementById('localResult');
    this.containerStatistics = document.getElementById('statistic');
    this.sound = document.querySelector('.audio');
    this.close = document.querySelector('.close');
    this.validStatistics = document.querySelector('.finish-statistics__answers-valid');
    this.inValidStatistics = document.querySelector('.finish-statistics__answers-invalid');
    this.validStatisticsTitle = document.querySelector('.finish-statistics__answers-valid-title');
    this.inValidStatisticsTitle = document.querySelector('.finish-statistics__answers-invalid-title');
    this.restartTraining = document.querySelector('.restart-training');
    this.finishTraining = document.querySelector('.finish-training');
  }

  innerTextLocalResult(result) {
    this.localResultContainer.innerText = result;
  }

  clearChooseWordContainer() {
    this.chooseWordContainer.innerText = [];
  }

  deleteOldGameTable() {
    while (this.table.firstChild) {
      this.table.removeChild(this.table.firstChild);
    }
  }

  hideLouder() {
    this.louderContainer.classList.add('inactive');
  }

  showLouder() {
    this.louderContainer.classList.remove('inactive');
  }

  showFillWord() {
    this.containerFillWord.classList.remove('inactive');
  }

  hideFillWord() {
    this.containerFillWord.classList.add('inactive');
  }

  showStartPage() {
    this.containerStartPage.classList.remove('inactive');
  }

  hideStartPage() {
    this.containerStartPage.classList.add('inactive');
  }

  hideDropOptions() {
    this.settingsMenu.classList.add('inactive');
  }

  hideOptions() {
    this.options.classList.add('inactive');
  }

  showOptions() {
    this.options.classList.remove('inactive');
  }

  hideSound() {
    this.sound.classList.add('inactive');
  }

  showSound() {
    this.sound.classList.remove('inactive');
  }

  showCorrectResult() {
    this.localResultContainer.innerText = 'ВЕРНО';
    this.localResultContainer.style.backgroundColor = '#4caf50';
  }

  showIncorrectResult() {
    this.localResultContainer.innerText = 'НЕВЕРНО';
    this.localResultContainer.style.backgroundColor = '#dd3333';
  }

  clearStyleResult() {
    this.localResultContainer.innerText = '';
    this.localResultContainer.style.backgroundColor = '#038573';
  }

  bindClickRestartTraining(handler) {
    this.restartTraining.addEventListener('click', () => {
      handler();
    });
  }

  bindClickFinishTraining(handler) {
    this.finishTraining.addEventListener('click', () => {
      handler();
    });
  }

  bindClickTable(handler) {
    this.table.addEventListener('mouseup', () => {
      handler();
    });
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
        this.settingsMenu.classList.toggle('inactive');
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

  renderField(newField, mouseMoveHandler, mouseDownHandler) {
    for (let i = 0; i < newField.length; i += 1) {
      const tr = document.createElement('tr');

      for (let j = 0; j < newField[i].length; j += 1) {
        const td = document.createElement('td');
        td.innerText = newField[i][j];
        td.setAttribute('data-coordinate', `${i}_${j}`);

        td.addEventListener('mousemove', (el) => {
          mouseMoveHandler(el);
        });
        td.addEventListener('mousedown', (el) => {
          mouseDownHandler(el);
        });
        tr.append(td);
      }

      this.table.append(tr);
    }
  }

  addWordTranslateText(text) {
    this.wordTranslate.innerText = text;
  }

  showStatistics() {
    this.containerStatistics.classList.remove('inactive');
  }

  hideStatistics() {
    this.containerStatistics.classList.add('inactive');
  }

  renderStatistics(data) {
    this.showStatistics();
    let statisticsAnswer = '';
    this.validStatistics.textContent = '';
    this.inValidStatistics.textContent = '';
    this.validStatisticsTitle.textContent = `ЗНАЮ: ${data.filter((e) => e.isCorrect === true).length}`;
    this.inValidStatisticsTitle.textContent = `ОШИБОК: ${data.filter((e) => e.isCorrect === false).length}`;
    data
      .forEach((element) => {
        if (element.isCorrect === true) {
          statisticsAnswer = createElementDOM('div', 'finish-statistics__answer', this.validStatistics);
        }
        if (element.isCorrect === false) {
          statisticsAnswer = createElementDOM('div', 'finish-statistics__answer', this.inValidStatistics);
        }
        statisticsAnswer.dataset.audio = element.audio;
        createElementDOM('div', 'finish-statistics__answer-audio', statisticsAnswer);
        createElementDOM('div', 'finish-statistics__answer-eng', statisticsAnswer).textContent = element.en;
        createElementDOM('div', 'finish-statistics__answer-dash', statisticsAnswer).textContent = '—';
        createElementDOM('div', 'finish-statistics__answer-ru', statisticsAnswer).textContent = element.ru;
      });
  }

  static removeSelectCell() {
    const cell = document.querySelectorAll('td');
    cell.forEach((e) => {
      e.classList.remove('select');
    });
  }
}

import ProgressBar from 'progressbar.js';
import Api from '../../js/api';

export default class Sprint {
  constructor(selector) {
    this.container = document.querySelector(selector);
    this.init();
  }

  async init() {
    this.createElement();
    this.api = new Api();
    this.group = 0;
    this.wordsArrayFull = await this.getWordsList();
    this.updateCard();
    this.isGetUserWords = true;
    const bar = new ProgressBar.Circle('#timer', {
      color: '#aaa',
      // This has to be the same size as the maximum width to
      // prevent clipping
      strokeWidth: 4,
      trailWidth: 1,
      easing: 'easeInOut',
      duration: 1400,
      text: {
        autoStyleContainer: false,
      },
      from: { color: '#aaa', width: 1 },
      to: { color: '#179298', width: 4 },
      // Set default step function for all animate calls
      step(state, circle) {
        circle.path.setAttribute('stroke', state.color);
        circle.path.setAttribute('stroke-width', state.width);

        const value = Math.round(circle.value() * 60);
        if (value === 0) {
          circle.setText('');
        } else {
          circle.setText(value);
        }
      },
    });
    bar.animate(1.0); // Number from 0.0 to 1.0
  }

  createElement() {
    this.container.classList.add('sprint');
    this.container.innerHTML = `
    <div class="score">10</div>
    <div id="timer" class="timer"></div>
    <div class="card">
      <div class="answer-correct">
        <ul class="answer-correct__list">
          <li class="answer-correct__list-item">&#10004;</li>
          <li class="answer-correct__list-item"></li>
          <li class="answer-correct__list-item"></li>
        </ul>
      </div>
      <div class="progress-images"></div>
      <div class="word"></div>
      <div class="word-translate"></div>
      <div class="answer-incorrect active">&#10006;</div>
      <div class="control-buttons">
        <button type="button" class="button button-wrong">Неверно</button>
        <button type="button" class="button button-right">Верно</button>
      </div>
    </div>
    <div class="addition">
      <div class="control-arrow">
        <button type="button" class="button-arrow left">&larr;</button>
        <button type="button" class="button-arrow right">&rarr;</button>
      </div>
      <div class="image-sound"></div>
    </div>
    `;
    this.wordElement = document.querySelector('.word');
    this.wordTranslateElement = document.querySelector('.word-translate');
  }

  getWordsList() {
    if (this.isGetUserWords) {
      return this.api.getUserWords()
        .then((response) => {
          this.isGetUserWords = false;
          if (response && response.length !== 0) {
            const wordsListId = response;
            const promises = wordsListId.map((element) => this.api.getWordById(element.wordId));
            return Promise.all(promises)
              .then((responseUserWords) => Sprint.mixWords(responseUserWords));
          }
          return this.getRandomWords();
        });
    }
    return this.getRandomWords();
  }

  getRandomWords() {
    const pageRandom = Math.floor(Math.random() * 29);
    return this.api.getWords(this.group, pageRandom)
      .then((responseRandomWords) => Sprint.mixWords(responseRandomWords));
  }

  static mixWords(wordsArray) {
    const randomArray = wordsArray.sort(() => 0.5 - Math.random());
    return randomArray.map((element, index) => {
      const correct = 0.5 - Math.random() > 0;
      if (correct) {
        return { word: element.word, wordTranslate: element.wordTranslate, correct: true };
      }
      let elementIncorrect = randomArray[index + 2];
      if (elementIncorrect === undefined) {
        [elementIncorrect] = randomArray;
      }
      return { word: element.word, wordTranslate: elementIncorrect.wordTranslate, correct: false };
    });
  }

  async updateCard() {
    this.word = this.wordsArrayFull.shift();
    if (this.wordsArrayFull.length === 0) {
      this.wordsArrayFull = await this.getWordsList();
    }
    this.wordElement.innerHTML = this.word.word;
    this.wordTranslateElement.innerHTML = this.word.wordTranslate;
  }
}

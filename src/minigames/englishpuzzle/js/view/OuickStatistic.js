import eventEmitter from '../services/eventEmitter';

export default class QuickStatistic {
  constructor() {
    this.searchElements();
    this.setListeners();
  }

  searchElements() {
    this.statisticBox = document.querySelector('.statistic');
    this.correctBox = document.querySelector('.know');
    this.incorrectBox = document.querySelector('.dont');
    this.continueBtn = document.querySelector('.statistic-continue__btn');
    this.homeBtn = document.querySelector('.statistic-home__btn');
  }

  setListeners() {
    this.continueBtn.addEventListener('click', () => {
      eventEmitter.emit('continue');
    });
    this.homeBtn.addEventListener('click', () => {
      eventEmitter.emit('goHome');
    });
  }

  show(statistic) {
    this.draw(statistic);
    this.statisticBox.classList.add('slide-in-fwd-center');
  }

  hide() {
    this.statisticBox.classList.remove('slide-in-fwd-center');
  }

  draw(statistic) {
    this.drawCorrect(statistic.correct);
    this.drawIncorrect(statistic.incorrect);
  }

  drawCorrect(words) {
    this.correctBox.innerHTML = '';
    const title = document.createElement('h2');
    title.classList.add('know-title');
    title.textContent = 'I know';
    this.correctBox.appendChild(title);
    words.forEach((word) => {
      const phrase = document.createElement('p');
      phrase.classList.add('i-know');
      phrase.textContent = word.englishPhrase;
      const icon = document.createElement('img');
      icon.setAttribute('src', '/assets/img/volume-up-solid.svg');
      icon.classList.add('jello-horizontal');
      const audio = document.createElement('audio');
      audio.setAttribute('src', word.enAudio);

      icon.addEventListener('click', () => {
        audio.play();
      });

      this.correctBox.appendChild(phrase);
      phrase.appendChild(icon);
      phrase.appendChild(audio);
    });
  }

  drawIncorrect(words) {
    this.incorrectBox.innerHTML = '';
    const title = document.createElement('h2');
    title.classList.add('dont-title');
    title.textContent = 'I dont know';
    this.incorrectBox.appendChild(title);
    words.forEach((word) => {
      const phrase = document.createElement('p');
      phrase.classList.add('i-dont');
      phrase.textContent = word.englishPhrase;
      const icon = document.createElement('img');
      icon.setAttribute('src', '/assets/img/volume-up-solid.svg');
      icon.classList.add('jello-horizontal');
      const audio = document.createElement('audio');
      audio.setAttribute('src', word.enAudio);

      icon.addEventListener('click', () => {
        audio.play();
      });

      this.incorrectBox.appendChild(phrase);
      phrase.appendChild(icon);
      phrase.appendChild(audio);
    });
  }
}

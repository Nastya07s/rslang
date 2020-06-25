
import EventMixin from '../mixins/eventMixin';

class QuickStatistic {
  constructor() {
    this.statisticBox = document.querySelector('.statistic');
    this.correctBox = document.querySelector('.know');
    this.incorrectBox = document.querySelector('.dont');
    this.closeButton = document.querySelector('.close-statistic');

    this.closeButton.addEventListener('click', () => {
      this.emit('closeStat');
      this.hide();
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

Object.assign(QuickStatistic.prototype, EventMixin);
export default QuickStatistic;

export default class Sprint {
  constructor(selector) {
    this.container = document.querySelector(selector);
    this.createElement();
  }

  createElement() {
    this.container.classList.add('sprint');
    this.container.innerHTML = `
    <div class="score"></div>
    <div class="timer"></div>
    <div class="card">
      <div class="answer-correct"></div>
      <div class="progress-images"></div>
      <div class="word"></div>
      <div class="word-translate"></div>
      <div class="answer-incorrect"></div>
      <div class="control-buttons"></div>
    </div>
    <div class="addition">
      <div class="control-arrow"></div>
      <div class="image-sound"></div>
    </div>
    `;
  }
}

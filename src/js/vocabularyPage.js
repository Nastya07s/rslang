import markup from './markup';

class VocabularyPage {
  constructor() {
    this.parent = document.querySelector('.wrapper');
  }

  init() {
    this.render();
    this.initHandlers();
  }

  render() {
    this.parent.innerHTML = markup.vocabularyPage;
    const vocabularyCountainer = document.querySelector('.vocabulary__template');
    const word = document.createElement('div');
    word.classList.add('template-vocabulary__body', 'flex');
    word.innerHTML = `
    <div class="template-vocabulary__title flex">
      <div class="template-vocabulary__lvl">
        <div class="complexity flex">
          <span class="complexity__circle"></span>
          <span class="complexity__circle"></span>
          <span class="complexity__circle"></span>
          <span class="complexity__circle"></span>
          <span class="complexity__circle"></span>
        </div>
      </div>
      <div class="template-vocabulary__restore"><a href="">Восстановить</a></div>
      </div>
      <div class="template-vocabulary__all flex">
        <div class="template-vocabulary__info">
          <div class="template-vocabulary__word flex">
            <span>Agree - [əgríː] - согласна</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M11.6227 0.732372C11.3907 0.621705 11.1173 0.651038 10.9173 0.812372L4.432 6.00037H1.33333C0.598667 6.00037 0 6.59904 0 7.3337V12.667C0 13.403 0.598667 14.0004 1.33333 14.0004H4.432L10.916 19.1884C11.0373 19.2844 11.1853 19.3337 11.3333 19.3337C11.432 19.3337 11.5307 19.311 11.6227 19.267C11.8533 19.1564 12 18.923 12 18.667V1.3337C12 1.0777 11.8533 0.844372 11.6227 0.732372Z"
                stroke="black"
                stroke-opacity="0.56"
              />
              <path
                d="M15.3746 5.28569C15.112 5.02702 14.6906 5.03102 14.432 5.29102C14.1733 5.55369 14.176 5.97502 14.4373 6.23502C15.4453 7.22969 16 8.56702 16 10.0004C16 11.4337 15.4453 12.771 14.4373 13.7657C14.176 14.023 14.1733 14.4457 14.432 14.7084C14.5626 14.8404 14.7346 14.9057 14.9053 14.9057C15.0746 14.9057 15.244 14.8417 15.3746 14.7124C16.6386 13.4684 17.3333 11.7937 17.3333 10.0004C17.3333 8.20702 16.6386 6.53236 15.3746 5.28569Z"
                stroke="black"
                stroke-opacity="0.56"
              />
              <path
                d="M17.256 3.40704C16.9933 3.14704 16.572 3.14971 16.312 3.41104C16.0533 3.67237 16.056 4.09504 16.316 4.35371C17.832 5.85637 18.6667 7.86171 18.6667 10.0004C18.6667 12.139 17.832 14.143 16.316 15.6457C16.056 15.9057 16.0533 16.3284 16.312 16.5897C16.444 16.7204 16.6147 16.7857 16.7853 16.7857C16.9547 16.7857 17.1253 16.7217 17.256 16.5924C19.0267 14.839 20 12.4977 20 10.0004C20 7.50304 19.0267 5.16171 17.256 3.40704Z"
                stroke="black"
                stroke-opacity="0.56"
              />
            </svg>
          </div>
          <div class="template-vocabulary__example">
            <span>Пример:</span>
            <span>The students <b>agree</b> they have too much homework.</span>
          </div>
          <div class="template-vocabulary__value">
            <span>Значение:</span>
            <span>To <i>agree</i> is to have the same opinion or belief as another person.</span>
          </div>
          <div class="template-vocabulary__time flex">
            <div class="template-vocabulary__lasttime">Последие повторение: 2020.05.10</div>
            <div class="template-vocabulary__nexttime">Следующее повторение: 2020.06.25</div>
            <div class="template-vocabulary__num">Повторения: 6</div>
          </div>
        </div>
        <div class="template-vocabulary__image"><img src="/assets/img/imagecard.jpg" alt="" /></div>
      </div>`;
    vocabularyCountainer.append(word);
  }

  initHandlers() {
    this.parent.querySelector('.vocabulary__info').addEventListener('click', ({ target }) => {
      this.parent.querySelectorAll('.vocabulary__info-title').forEach((el) => {
        el.classList.remove('vocabulary__info-title-active');
      });

      target.closest('.vocabulary__info-title').classList.add('vocabulary__info-title-active');
    });
  }
}

const vocabularyPage = new VocabularyPage();

export default vocabularyPage;

import {
  Swiper, Navigation, Keyboard, Pagination,
} from '../../node_modules/swiper/js/swiper.esm';
import markup from './markup';
import settings from './settings';
import api from './api';

Swiper.use([Navigation, Keyboard, Pagination]);

function shuffleArray(array) {
  return array.sort(() => 0.5 - Math.random());
}

class MainPage {
  constructor() {
    this.parent = document.querySelector('.wrapper');
  }

  async init() {
    await settings.getSettings();
    const words = await this.getWords(settings);
    this.words = shuffleArray(words[0].paginatedResults);
    console.log('settings: ', settings);
    console.log('this.words: ', this.words);
    this.render();
    this.initSwiper();
    this.initHandlers();
  }

  render() {
    this.parent.innerHTML = markup.mainPage;
    const sliderContainer = document.querySelector('.swiper-wrapper');
    this.words.forEach((word) => {
      // console.log('word: ', word);
      const {
        textExample, textExampleTranslate, image, textMeaning, textMeaningTranslate,
      } = word;
      // const lettersWord = word.word.split('');
      const inputWord = `<div class="slider-b-body__input"><div class="background">${word.word}</div><div class="opacity-0">${word.word}</div><input type="text" placeholder=""/></div>`;
      const textExampleWithInput = textExample.replace(/<b.*<\/b>/, inputWord);
      console.log('textExample: ', textExample);
      // console.log('textExampleWithInput: ', textExampleWithInput);
      const placeForInput = settings.exampleSentence ? textExampleWithInput : inputWord;
      // const placeForInput = inputWord;
      const textMeaningWithoutWord = textMeaning.replace(/<i.*<\/i>/, '<i>[...]</i>');
      const slide = document.createElement('div');
      slide.classList.add('swiper-slide', 'card');
      slide.innerHTML = `
      <div class="slider-block__top flex">
        <div class="slider-block__complexity">
          <span class="slider-block__circle"></span>
          <span class="slider-block__circle"></span>
          <span class="slider-block__circle"></span>
          <span class="slider-block__circle"></span>
          <span class="slider-block__circle"></span>
        </div>
        <div class="slider-block__close d-none" data-settings="deleteButton">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0)">
              <path d="M11.1047 10.0008L19.7709 1.33448C20.0761 1.02937 20.0761 0.534678 19.7709 0.229601C19.4658 -0.0754772 18.9711 -0.0755163 18.6661 0.229601L9.99975 8.89592L1.33347 0.229601C1.02836 -0.0755163 0.533671 -0.0755163 0.228593 0.229601C-0.0764842 0.534718 -0.0765233 1.0294 0.228593 1.33448L8.89487 10.0008L0.228593 18.6671C-0.0765233 18.9722 -0.0765233 19.4669 0.228593 19.772C0.381132 19.9245 0.581093 20.0008 0.781053 20.0008C0.981014 20.0008 1.18094 19.9245 1.33351 19.772L9.99975 11.1057L18.666 19.772C18.8186 19.9245 19.0185 20.0008 19.2185 20.0008C19.4184 20.0008 19.6184 19.9245 19.7709 19.772C20.0761 19.4668 20.0761 18.9722 19.7709 18.6671L11.1047 10.0008Z" fill="black"/>
            </g>
            <defs>
              <clipPath id="clip0">
                <rect width="20" height="20" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
      <div class="slider-block__info">
        <div class="slider-block__img d-none" data-settings="associationImage">
          <img src="https://raw.githubusercontent.com/kamikozz/rslang-data/master/${image}" alt="" />
        </div>
        <div class="slider-block__body slider-b-body flex">
          <div class="slider-b-body__top">
            <form class="slider-b-body__title">
              ${placeForInput}
            </form>
            <audio src="https://raw.githubusercontent.com/kamikozz/rslang-data/master/${word.audio}"></audio>
            <audio src="https://raw.githubusercontent.com/kamikozz/rslang-data/master/${word.audioExample}"></audio>
            <div class="slider-b-body__sub opacity-0">${textExampleTranslate}</div>
          </div>
          <div class="slider-b-body__center d-none" data-settings="definitionSentence">
            <div class="slider-b-body__show flex">
              <span>Показать объяснение значения слова</span>
              <img class="slider-b-body__accordionshow closeArrow" src="/assets/img/arrowDown.png" alt="1" />
            </div>
            <div class="slider-b-body__goshow opacity-0">
              <div class="slider-b-body__example">
                ${textMeaningWithoutWord}
              </div>
              <div class="slider-b-body__example slider-b-body__example-full d-none">
                ${textMeaning}
              </div>
              <div class="slider-b-body__text opacity-0">
                ${textMeaningTranslate}
              </div>
              <audio src="https://raw.githubusercontent.com/kamikozz/rslang-data/master/${word.audioMeaning}"></audio>
            </div>
          </div>
          <div class="slider-b-body__bottom flex">
            <div class="slider-b-body__get flex d-none" data-settings="hardWordsButton">
              <span
                >Добавить в<br />
                сложные слова</span
              ><label >
                  <input type="checkbox" class="custom-checkbox" name="happy" value="yes" />
                  <span></span>
              </label>
            </div>
            <div class="slider-b-body__more">
              <div class="slider-b-body__answer d-none">
                <span>${word.word}</span>
                <span class="d-none" data-settings="transcription"> - ${word.transcription}</span>
                <span class="d-none" data-settings="translateWord"> - ${word.wordTranslate}</span>
              </div>
              <div class="slider-b-body__showAnswer d-none" data-settings="answerButton">
                <span>Показать ответ</span>
              </div>
            </div>
          </div>
        </div>
      </div>`;

      slide.querySelectorAll('[data-settings]').forEach((el) => {
        if (settings[el.dataset.settings]) el.classList.remove('d-none');
      });
      if (!settings.associationImage) slide.querySelector('.slider-block__body').classList.add('slider-block__body-full');
      if (settings.learningMode !== 'new') {
        let count = +word.userWord.optional.degreeOfKnowledge;
        slide.querySelectorAll('.complexity__circle').forEach((el) => {
          if (count) {
            el.classList.add('complexity__circle-active');
            count -= 1;
          }
        });
      }
      const text = slide.querySelector('.slider-b-body__input div:not(.background)');
      sliderContainer.append(slide);
      console.log('text: ', text);
      slide.querySelector('.slider-b-body__input input').style.width = `${text.offsetWidth}px`;
      slide.querySelector('.slider-b-body__input div').style.width = `${text.offsetWidth}px`;
      // slide.querySelector('.slider-b-body__title div').classList.add('d-none');
    });
  }

  initSwiper() {
    this.mySwiper = new Swiper('.swiper-container', {
      slidesPerView: 'auto',
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.bar-block__line',
        type: 'progressbar',
        progressbarFillClass: 'bar-block__linebar',
      },
      keyboard: true,
      loop: false,
      allowTouchMove: true,
    });
  }

  initHandlers() {
    this.parent.querySelectorAll('.slider-block__info').forEach((el) => {
      el.querySelector('.slider-b-body__show').addEventListener('click', () => {
        el.querySelector('.slider-b-body__goshow').classList.toggle('opacity-0');
        el.querySelector('.slider-b-body__accordionshow').classList.toggle('openArrow');
        el.querySelector('.slider-b-body__accordionshow').classList.toggle('closeArrow');
      });
    });

    this.parent.querySelector('.lvl-block').addEventListener('click', ({ target }) => {
      this.parent.querySelectorAll('.lvl-block__item').forEach((el) => {
        el.classList.remove('lvl-block__item-active');
      });

      target.closest('.lvl-block__item').classList.add('lvl-block__item-active');
    });

    this.parent.querySelector('.bar-block__numone').textContent = this.mySwiper.realIndex + 1;
    this.parent.querySelector('.bar-block__numtwo').textContent = this.mySwiper.slides.length;

    this.mySwiper.on('slideChange', () => {
      this.parent.querySelector('.bar-block__numone').textContent = this.mySwiper.realIndex + 1;
    });

    this.parent.querySelectorAll('.slider-b-body__title').forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const slide = form.closest('.swiper-slide');
        slide.querySelector('.slider-b-body__sub').classList.remove('opacity-0');
        slide.querySelector('.slider-b-body__text').classList.remove('opacity-0');
        slide.querySelector('.slider-b-body__answer').classList.remove('d-none');
        slide.querySelector('.slider-b-body__showAnswer').classList.add('d-none');
        slide.querySelector('.slider-b-body__example-full').classList.remove('d-none');
        slide.querySelector('.slider-b-body__example').classList.add('d-none');
        // slide.querySelector('.slider-b-body__input div').style.zIndex = '2';

        const typedWord = slide.querySelector('.slider-b-body__input input').value.split('');
        const rightWord = slide.querySelector('.slider-b-body__input div:not(.background)').textContent.split('');
        // console.log('rightWord: ', rightWord);
        let resultWord = '';
        rightWord.forEach((letter, i) => {
          if (letter === typedWord[i]) {
            // console.log(2);
            resultWord += `<span class="slider-b-body__input-right">${letter}</span>`;
          } else {
            // console.log(3);
            resultWord += `<span class="slider-b-body__input-wrong">${letter}</span>`;
          }
        });
        slide.querySelector('.slider-b-body__input div:not(.background)').innerHTML = resultWord;
        // console.log('resultWord: ', resultWord);
        // slide.querySelector('.slider-b-body__input div').classList.add('opacity-0');
        slide.querySelector('.slider-b-body__input div:not(.background)').classList.remove('opacity-0');
        //   }
        // });
        if (slide.querySelectorAll('.slider-b-body__input-wrong').length === 0) {
          // this.parent.querySelector('.swiper-button-next').click();
          this.parent.querySelector('.block__lvl').classList.remove('opacity-0');
        } else {
          slide.querySelector('.slider-b-body__input input').value = '';
        }
      });
    });

    this.parent.querySelectorAll('.slider-b-body__showAnswer').forEach((button) => {
      button.addEventListener('click', ({ target }) => {
        target.closest('.slider-block__body').querySelector('.slider-b-body__title').requestSubmit();
      });
    });

    window.addEventListener('resize', () => {
      const width = window.innerWidth;

      if (width <= 768) {
        this.parent.querySelectorAll('.slider-b-body__input').forEach((el) => {
          const localEl = el;
          localEl.querySelector('input').style.width = `${localEl.querySelector('div').offsetWidth}px`;
        });
      }
    });
  }

  async getWords({ learningMode, wordsPerDay }) {
    this.parent = document.querySelector('.wrapper');
    let words = [];
    switch (learningMode) {
      case 'new':
        words = await api.getUsersAggregatedWords(0, wordsPerDay, false, {
          $or: [{ userWord: null }],
        });
        // words = await api.getUsersAggregatedWords(0, 20, false, {
        //   $nor: [{ userWord: null }],
        // });
        return words;
      case 'learning':
        words = await api.getUsersAggregatedWords(0, wordsPerDay, false, {
          // $nor: [{ userWord: null }],
        });
        return words;
      case 'old':
        words = await api.getUsersAggregatedWords(0, 3, false, {
          // $nor: [{ userWord: null }],
        });
        return words;
      default:
        words = await api.getUsersAggregatedWords(0, 3, false, {
          // $nor: [{ userWord: null }],
        });
        return words;
    }
  }
}

const mainPage = new MainPage();

export default mainPage;

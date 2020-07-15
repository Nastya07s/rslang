import performRequests from 'app/js/utils/perform-requests';
import settings from 'app/js/settings';
import api from 'app/js/api';
import {
  Swiper, Navigation, Keyboard, Pagination,
} from '../../../node_modules/swiper/js/swiper.esm';
import markup from './markup';
import store from './store';

Swiper.use([Navigation, Keyboard, Pagination]);

const shuffleArray = (array) => array.sort(() => 0.5 - Math.random());

const processData = (data) => {
  const [responseResults] = data;
  const [results] = responseResults;
  const { paginatedResults } = results;
  return paginatedResults;
};

const getMixWords = async () => {
  let wordLeft = 0;

  const oldWordsResponse = await performRequests([
    api.getUsersAggregatedWords.bind(api, {
      wordsPerPage: 2,
      filter: {
        $and: [
          {
            $nor: [{ userWord: null }],
          },
          {
            'userWord.optional.degreeOfKnowledge': {
              $eq: 5,
            },
          },
          {
            'userWord.optional.isDelete': {
              $eq: false,
            },
          },
        ],
      },
    }),
  ]);
  const oldWords = processData(oldWordsResponse);

  wordLeft = 2 - oldWords.length;

  const countLearningWords = settings.wordsPerDay + wordLeft - settings.countNewWords - 2;
  const learningWordsResponse = await performRequests([
    api.getUsersAggregatedWords.bind(api, {
      wordsPerPage: countLearningWords,
      filter: {
        $and: [
          {
            $nor: [{ userWord: null }],
          },
          {
            'userWord.optional.degreeOfKnowledge': {
              $lt: 5,
            },
          },
          {
            'userWord.optional.isDelete': {
              $eq: false,
            },
          },
          {
            'userWord.optional.isReadyToRepeat': {
              $eq: true,
            },
          },
        ],
      },
    }),
  ]);
  const learningWords = processData(learningWordsResponse);

  wordLeft = settings.wordsPerDay - learningWords.length - wordLeft - 2;

  const newWordsResponse = await performRequests([
    api.getUsersAggregatedWords.bind(api, {
      wordsPerPage: wordLeft,
      filter: {
        $and: [{ userWord: null }],
      },
    }),
  ]);
  const newWords = processData(newWordsResponse);

  return [...oldWords, ...learningWords, ...newWords];
};

const switchClasses = (arrayElements, many = false) => {
  if (many) {
    arrayElements.forEach(({
      parent, classEl, changingClass, fl,
    }) => {
      if (fl) parent.querySelector(classEl).classList.add(changingClass);
      else parent.querySelector(classEl).classList.remove(changingClass);
    });
  } else {
    arrayElements.forEach(({
      parent, classEl, changingClass, fl,
    }) => {
      parent.querySelectorAll(classEl).forEach((el) => {
        if (fl) el.classList.add(changingClass);
        else el.classList.remove(changingClass);
      });
    });
  }
};

const showMeaning = (el) => {
  el.querySelector('.slider-b-body__show').addEventListener('click', () => {
    el.querySelector('.slider-b-body__goshow').classList.toggle('opacity-0');
    el.querySelector('.slider-b-body__accordionshow').classList.toggle('openArrow');
    el.querySelector('.slider-b-body__accordionshow').classList.toggle('closeArrow');
  });
};

class MainPage {
  constructor() {
    this.parent = document.querySelector('.wrapper');
    this.words = [];
    this.slides = [];
    this.audios = {};
  }

  async init() {
    store.isRendered = false;
    const wordsResponse = await this.getWords(settings);
    const words = shuffleArray(wordsResponse);

    if (
      !localStorage.getItem('mainWords')
      || (localStorage.getItem('mainStatistics')
        && JSON.parse(localStorage.getItem('mainStatistics')).day !== new Date().getDate())
    ) {
      localStorage.setItem('mainWords', JSON.stringify(words));
    }

    this.words = JSON.parse(localStorage.getItem('mainWords'));
    const numberOfNewWords = this.words.filter((word) => !word.userWord).length;

    if (
      !localStorage.getItem('mainStatistics')
      || JSON.parse(localStorage.getItem('mainStatistics')).day !== new Date().getDate()
    ) {
      settings.update('learningMode', 'mix');
      localStorage.setItem(
        'mainStatistics',
        JSON.stringify({
          cardsCompleted: 0,
          numberOfCorrectAnswer: 0,
          numberOfNewWords,
          longestSeriesOfCorrectAnswers: [],
          day: new Date().getDate(),
        }),
      );
    }

    this.render();
    if (this.cardsCompleted < settings.wordsPerDay) {
      this.slides = this.parent.querySelectorAll('.swiper-slide');
      this.initSwiper();
      this.initHandlers();
    }
  }

  render() {
    const {
      cardsCompleted, numberOfCorrectAnswer, numberOfNewWords, longestSeriesOfCorrectAnswers,
    } = JSON.parse(
      localStorage.getItem('mainStatistics'),
    );

    this.cardsCompleted = +cardsCompleted;
    this.numberOfCorrectAnswer = +numberOfCorrectAnswer;
    this.numberOfNewWords = +numberOfNewWords;
    this.longestSeriesOfCorrectAnswers = longestSeriesOfCorrectAnswers;

    this.parent.innerHTML = markup.mainPage;

    if (this.cardsCompleted >= settings.wordsPerDay && this.cardsCompleted >= this.slides.length) {
      this.parent.querySelector('section').innerHTML = '';
      this.parent.querySelector('section').classList.add('d-none');
      this.parent.querySelector('section').style.width = '0';

      const modal = this.parent.querySelector('.modal');
      this.parent.querySelector('.modal').classList.remove('d-none');
      modal.querySelector('.cardsCompleted').textContent = this.cardsCompleted;
      const correctAnswers = this.longestSeriesOfCorrectAnswers
        .slice(0, settings.wordsPerDay)
        .filter((num) => num === 1).length;
      modal.querySelector('.correctAnswers').textContent = `${(correctAnswers * 100) / settings.wordsPerDay}%`;
      modal.querySelector('.numberOfNewWords').textContent = this.numberOfNewWords;
      let max = 0;
      let currentMax = 0;
      this.longestSeriesOfCorrectAnswers.forEach((num) => {
        if (num === 1) currentMax += 1;
        else {
          if (max < currentMax) max = currentMax;
          currentMax = 0;
        }
      });
      modal.querySelector('.longestSeriesOfCorrectAnswers').textContent = max;
      return;
    }

    const sliderContainer = document.querySelector('.swiper-wrapper');
    if (settings.learningMode === 'new') this.words = this.words.filter((word) => !word.userWord);
    if (settings.learningMode === 'learning') this.words = this.words.filter((word) => word.userWord && word.userWord.optional.degreeOfKnowledge < 5);
    if (settings.learningMode === 'old') this.words = this.words.filter((word) => word.userWord && word.userWord.optional.degreeOfKnowledge === 5);

    this.words.forEach((word) => {
      const {
        textExample, textExampleTranslate, image, textMeaning, textMeaningTranslate, _id: id,
      } = word;
      this.audios[id] = [word.audio, word.audioMeaning, word.audioExample];
      const inputWord = `<div class="slider-b-body__input"><div class="background">${word.word}</div><div class="opacity-0">${word.word}</div><input type="text" placeholder="" autofocus/></div>`;
      const textExampleWithInput = textExample.replace(/<b.*<\/b>/, inputWord);
      const placeForInput = settings.exampleSentence ? textExampleWithInput : inputWord;
      const textMeaningWithoutWord = textMeaning.replace(/<i.*<\/i>/, '<i>[...]</i>');
      const slide = document.createElement('div');
      slide.classList.add('swiper-slide', 'card');

      slide.setAttribute('data-id', id);
      slide.setAttribute('data-isguessed', 'false');
      slide.setAttribute('data-firstattempt', 'true');

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
            </div>
          </div>
          <div class="slider-b-body__bottom flex">
            <div class="slider-b-body__get flex d-none opacity-0" data-settings="hardWordsButton">
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
        let count;
        if (!word.userWord) {
          count = 0;
        } else {
          count = +word.userWord.optional.degreeOfKnowledge;
        }
        slide.querySelectorAll('.slider-block__circle').forEach((el) => {
          if (count) {
            el.classList.add('slider-block__circle-active');
            count -= 1;
          }
        });
      }
      const text = slide.querySelector('.slider-b-body__input div:not(.background)');
      sliderContainer.append(slide);
      slide.querySelector('.slider-b-body__input input').style.width = `${text.offsetWidth}px`;
      slide.querySelector('.slider-b-body__input div').style.width = `${text.offsetWidth}px`;
    });
  }

  async initSwiper() {
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
      loop: false,
      allowTouchMove: true,
    });
    this.mySwiper.slideTo(this.cardsCompleted);

    this.mySwiper.keyboard.disable();

    this.parent.querySelector('.swiper-button-next').classList.add('swiper-button-disabled');
    this.parent.querySelector('.swiper-button-prev').classList.add('swiper-button-disabled');

    this.parent.querySelector('.bar-block__numone').textContent = this.mySwiper.realIndex + 1;
    this.parent.querySelector('.bar-block__numtwo').textContent = this.mySwiper.slides.length;

    const idWord = this.slides[this.mySwiper.activeIndex].dataset.id;
    const [word] = await api.getUsersAggregatedWordsById(idWord);

    if (!word.userWord) {
      api.createUserWord(idWord, {
        difficulty: String(word.group),
        optional: {
          countRepetition: 1,
          isDelete: false,
          isHard: false,
          isReadyToRepeat: false,
          lastRepetition: Date.now(),
          degreeOfKnowledge: 0,
          becameLearned: 0,
        },
      });
    }
  }

  async initHandlers() {
    this.parent.querySelectorAll('.slider-block__info').forEach((el) => {
      showMeaning(el);
    });

    this.parent.querySelector('.lvl-block').addEventListener('click', ({ target }) => {
      this.parent.querySelectorAll('.lvl-block__item').forEach((el) => {
        el.classList.remove('lvl-block__item-active');
      });
      target.closest('.lvl-block__item').classList.add('lvl-block__item-active');
    });

    this.mySwiper.on('slideChange', async () => {
      this.mySwiper.keyboard.disable();

      this.parent.querySelector('.swiper-button-next').classList.add('swiper-button-disabled');
      this.parent.querySelector('.swiper-button-prev').classList.add('swiper-button-disabled');
      this.parent.querySelector('.bar-block__numone').textContent = this.mySwiper.realIndex + 1;

      const idWord = this.slides[this.mySwiper.activeIndex].dataset.id;
      const [word] = await api.getUsersAggregatedWordsById(idWord);

      if (!word.userWord) {
        api.createUserWord(idWord, {
          difficulty: String(word.group),
          optional: {
            countRepetition: 1,
            isDelete: false,
            isHard: false,
            isReadyToRepeat: false,
            lastRepetition: Date.now(),
            degreeOfKnowledge: 0,
            becameLearned: 0,
          },
        });
      }

      this.parent.querySelectorAll('.lvl-block__item').forEach((el) => {
        el.classList.remove('lvl-block__item-active');
      });

      this.slides[this.mySwiper.activeIndex - 1].querySelector('audio').pause();

      if (this.slides[this.mySwiper.activeIndex].dataset.isguessed === 'true') {
        this.parent.querySelector('.block__lvl').classList.remove('opacity-0');
        this.parent.querySelector('.block__lvl').classList.remove('pointerEvents');
      } else {
        this.parent.querySelector('.block__lvl').classList.add('opacity-0');
        this.parent.querySelector('.block__lvl').classList.add('pointerEvents');
      }
    });

    this.parent.querySelectorAll('.slider-b-body__title').forEach(async (form) => {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const slide = form.closest('.swiper-slide');
        slide.querySelector('.slider-b-body__sub').classList.remove('opacity-0');
        slide.querySelector('.slider-b-body__text').classList.remove('opacity-0');
        slide.querySelector('.slider-b-body__answer').classList.remove('d-none');
        slide.querySelector('.slider-b-body__showAnswer').classList.add('d-none');
        slide.querySelector('.slider-b-body__example-full').classList.remove('d-none');
        slide.querySelector('.slider-b-body__example').classList.add('d-none');
        slide.querySelector('.slider-b-body__get ').classList.remove('opacity-0');

        const idWord = slide.dataset.id;
        const [word] = await api.getUsersAggregatedWordsById(idWord);
        let { countRepetition } = word.userWord.optional;

        const typedWord = slide.querySelector('.slider-b-body__input input').value.split('');
        const rightWord = slide.querySelector('.slider-b-body__input div:not(.background)').textContent.split('');
        let resultWord = '';
        rightWord.forEach((letter, i) => {
          if (letter === typedWord[i]) {
            resultWord += `<span class="slider-b-body__input-right">${letter}</span>`;
          } else {
            resultWord += `<span class="slider-b-body__input-wrong">${letter}</span>`;
          }
        });
        slide.querySelector('.slider-b-body__input div:not(.background)').innerHTML = resultWord;

        slide.querySelector('.slider-b-body__input div:not(.background)').classList.remove('opacity-0');

        if (slide.querySelectorAll('.slider-b-body__input-wrong').length === 0) {
          slide.setAttribute('data-isguessed', 'true');
          countRepetition += 1;
        } else {
          slide.querySelector('.slider-b-body__input input').value = '';
          slide.setAttribute('data-firstattempt', 'false');
        }

        if (this.slides[this.mySwiper.activeIndex].dataset.isguessed === 'true') {
          this.mySwiper.keyboard.enable();
          this.parent.querySelector('.swiper-button-next').classList.remove('swiper-button-disabled');
          this.parent.querySelector('.block__lvl').classList.remove('opacity-0');
          this.parent.querySelector('.block__lvl').classList.remove('pointerEvents');

          form.querySelector('input').blur();
          form.querySelector('input').setAttribute('disabled', 'disabled');

          const mainStatistics = JSON.parse(localStorage.getItem('mainStatistics'));

          if (this.slides[this.mySwiper.activeIndex].dataset.firstattempt === 'false') {
            slide.setAttribute('data-isguessed', 'false');
            slide.setAttribute('data-firstattempt', 'true');

            const newSlide = slide.cloneNode(true);

            const [wordObject] = await api.getUsersAggregatedWordsById(idWord);
            this.words.push(wordObject);
            localStorage.setItem('mainWords', JSON.stringify(this.words));

            this.parent.querySelector('.bar-block__numone').textContent = this.mySwiper.realIndex + 1;
            this.parent.querySelector('.bar-block__numtwo').textContent = this.mySwiper.slides.length;
            newSlide.querySelector('.slider-b-body__sub').classList.add('opacity-0');
            newSlide.querySelector('.slider-b-body__text').classList.add('opacity-0');
            newSlide.querySelector('.slider-b-body__answer').classList.add('d-none');
            newSlide.querySelector('.slider-b-body__showAnswer').classList.remove('d-none');
            newSlide.querySelector('.slider-b-body__example-full').classList.add('d-none');
            newSlide.querySelector('.slider-b-body__example').classList.remove('d-none');
            newSlide.querySelector('.slider-b-body__get ').classList.add('opacity-0');
            newSlide.querySelector('.slider-b-body__input div:not(.background)').innerHTML = '';
            newSlide.querySelector('.slider-b-body__input input').value = '';

            newSlide.querySelector('input').removeAttribute('disabled');

            let count;
            if (!wordObject.userWord) {
              count = 0;
            } else {
              count = +wordObject.userWord.optional.degreeOfKnowledge;
            }
            newSlide.querySelectorAll('.slider-block__circle').forEach((el) => {
              if (count) {
                el.classList.add('slider-block__circle-active');
                count -= 1;
              }
            });

            this.mySwiper.appendSlide(newSlide);
            this.slides = this.parent.querySelectorAll('.swiper-slide');

            mainStatistics.numberOfCorrectAnswer += 1;
            this.longestSeriesOfCorrectAnswers.push(0);
          } else this.longestSeriesOfCorrectAnswers.push(1);

          if (settings.isGlobalMute) {
            const audioPlayer = slide.querySelector('audio');

            audioPlayer.src = `https://raw.githubusercontent.com/kamikozz/rslang-data/master/${
              this.audios[slide.dataset.id][0]
            }`;
            audioPlayer.play();
            let count = 2;
            audioPlayer.onended = () => {
              if (count !== 0) {
                audioPlayer.src = `https://raw.githubusercontent.com/kamikozz/rslang-data/master/${
                  this.audios[slide.dataset.id][count]
                }`;
                count -= 1;
                audioPlayer.play();
              }
            };

            // audioPlayer.play();
          }
          switchClasses([
            {
              parent: this.parent,
              classEl: '.swiper-button-next',
              changingClass: 'swiper-button-disabled',
              fl: false,
            },
          ]);

          this.numberOfCorrectAnswer = mainStatistics.numberOfCorrectAnswer;
          mainStatistics.longestSeriesOfCorrectAnswers = this.longestSeriesOfCorrectAnswers;
          this.cardsCompleted = mainStatistics.cardsCompleted + 1;
          mainStatistics.cardsCompleted = this.cardsCompleted;

          localStorage.setItem('mainStatistics', JSON.stringify(mainStatistics));
        } else {
          this.mySwiper.keyboard.disable();
          switchClasses([
            {
              parent: this.parent,
              classEl: '.swiper-button-next',
              changingClass: 'swiper-button-disabled',
              fl: true,
            },
          ]);
        }

        let degreeOfKnowledge = slide.dataset.firstattempt === 'true'
          ? word.userWord.optional.degreeOfKnowledge + 1
          : 0;

        const becameLearned = degreeOfKnowledge === 5
          ? Date.now() : word.userWord.optional.becameLearned;

        if (degreeOfKnowledge === 6) degreeOfKnowledge = 5;

        api.updateUserWordById(idWord, {
          difficulty: String(word.group),
          optional: {
            countRepetition,
            isDelete: word.userWord.optional.isDelete,
            isHard: word.userWord.optional.isHard,
            isReadyToRepeat: false,
            lastRepetition: Date.now(),
            degreeOfKnowledge,
            becameLearned,
          },
        });
      });
    });

    this.parent.querySelector('.swiper-button-next').addEventListener('click', () => {
      if (this.slides[this.mySwiper.activeIndex].dataset.isguessed === 'true') {
        this.mySwiper.keyboard.enable();
        this.parent.querySelector('.swiper-button-next').classList.remove('swiper-button-disabled');
      } else {
        this.mySwiper.keyboard.disable();
        this.parent.querySelector('.swiper-button-next').classList.add('swiper-button-disabled');
      }
    });

    this.parent.querySelectorAll('.slider-block__close').forEach((el) => {
      el.addEventListener('click', async () => {
        const slide = this.slides[this.mySwiper.activeIndex];
        const idWord = slide.dataset.id;
        const [word] = await api.getUsersAggregatedWordsById(idWord);
        const { countRepetition, degreeOfKnowledge } = word.userWord.optional;

        api.updateUserWordById(idWord, {
          difficulty: String(word.group),
          optional: {
            countRepetition,
            isDelete: true,
            isHard: word.userWord.optional.isHard,
            isReadyToRepeat: false,
            lastRepetition: Date.now(),
            degreeOfKnowledge,
            becameLearned: word.userWord.optional.becameLearned,
          },
        });
        this.mySwiper.slideNext();
      });
    });

    this.parent.querySelectorAll('.slider-b-body__get').forEach((el) => {
      el.addEventListener('click', async () => {
        const slide = this.slides[this.mySwiper.activeIndex];
        const idWord = slide.dataset.id;
        const [word] = await api.getUsersAggregatedWordsById(idWord);
        const { countRepetition, degreeOfKnowledge } = word.userWord.optional;

        api.updateUserWordById(idWord, {
          difficulty: String(word.group),
          optional: {
            countRepetition,
            isDelete: word.userWord.optional.isDelete,
            isHard: true,
            isReadyToRepeat: false,
            lastRepetition: Date.now(),
            degreeOfKnowledge,
            becameLearned: word.userWord.optional.becameLearned,
          },
        });
      });
    });

    this.parent.querySelectorAll('.slider-b-body__showAnswer').forEach((button) => {
      button.addEventListener('click', ({ target }) => {
        target.closest('.swiper-slide').setAttribute('data-firstattempt', 'false');
        target.closest('.slider-block__body').querySelector('.slider-b-body__title').requestSubmit();
        this.parent.querySelector('.block__lvl').classList.remove('opacity-0');
        this.parent.querySelector('.block__lvl').classList.remove('pointerEvents');
      });
    });

    this.parent.querySelector('.block__lvl').addEventListener('click', async ({ target }) => {
      const element = target.closest('.lvl-block__item');

      const slide = this.slides[this.mySwiper.activeIndex];
      const idWord = slide.dataset.id;
      const [word] = await api.getUsersAggregatedWordsById(idWord);
      const { countRepetition } = word.userWord.optional;

      const degreeOfKnowledge = +element.dataset.degreeofknowledge;

      if (degreeOfKnowledge === 0 && !slide.dataset.firstattempt === 'false') {
        slide.setAttribute('data-isguessed', 'false');
        slide.setAttribute('data-firstattempt', 'true');
        this.mySwiper.appendSlide(slide.outerHTML);
        this.parent.querySelector('.bar-block__numone').textContent = this.mySwiper.realIndex + 1;
        this.parent.querySelector('.bar-block__numtwo').textContent = this.mySwiper.slides.length;
      }

      api.updateUserWordById(idWord, {
        difficulty: String(word.group),
        optional: {
          countRepetition,
          isDelete: word.userWord.optional.isDelete,
          isHard: word.userWord.optional.isHard,
          isReadyToRepeat: false,
          lastRepetition: Date.now(),
          degreeOfKnowledge,
          becameLearned: word.userWord.optional.becameLearned,
        },
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
    const LEARNING_MODES = {
      NEW: 'new',
      LEARNING: 'learning',
      OLD: 'old',
      MIX: 'mix',
    };
    let filter;
    let words;

    switch (learningMode) {
      case LEARNING_MODES.NEW: {
        filter = {
          $and: [{ userWord: null }],
        };
        break;
      }
      case LEARNING_MODES.LEARNING: {
        filter = {
          $and: [
            {
              $nor: [{ userWord: null }],
            },
            {
              'userWord.optional.degreeOfKnowledge': {
                $lt: 5,
              },
            },
            {
              'userWord.optional.isDelete': {
                $eq: false,
              },
            },
            {
              'userWord.optional.isReadyToRepeat': {
                $eq: true,
              },
            },
          ],
        };
        break;
      }
      case LEARNING_MODES.OLD: {
        filter = {
          $and: [
            {
              $nor: [{ userWord: null }],
            },
            {
              'userWord.optional.degreeOfKnowledge': {
                $eq: 5,
              },
            },
            {
              'userWord.optional.isDelete': {
                $eq: false,
              },
            },
          ],
        };
        break;
      }
      default: {
        words = getMixWords();
        break;
      }
    }

    const params = {
      wordsPerPage: wordsPerDay,
      filter,
    };

    if (learningMode !== LEARNING_MODES.MIX) {
      const data = await performRequests([api.getUsersAggregatedWords.bind(api, params)]);
      words = processData(data);
    }
    return words;
  }
}

const mainPage = new MainPage();

export default mainPage;

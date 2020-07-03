import {
  Swiper,
  Navigation,
  Keyboard,
  Pagination,
} from '../../node_modules/swiper/js/swiper.esm';
import markup from './markup';

Swiper.use([Navigation, Keyboard, Pagination]);

class MainPage {
  constructor() {
    this.parent = document.querySelector('.wrapper');
  }

  init() {
    this.render();
    this.initSwiper();
    this.initHandlers();
  }

  render() {
    this.parent.innerHTML = markup.mainPage;
    const sliderContainer = document.querySelector('.swiper-wrapper');
    const slide = document.createElement('div');
    slide.classList.add('swiper-slide', 'card');
    slide.innerHTML = `
      <div class="slider-block__complexity">
        <span class="slider-block__circle"></span>
        <span class="slider-block__circle"></span>
        <span class="slider-block__circle"></span>
        <span class="slider-block__circle"></span>
        <span class="slider-block__circle"></span>
      </div>
      <div class="slider-block__info">
        <div class="slider-block__img"><img src="/assets/img/people.jpg" alt="" /></div>
        <div class="slider-block__body slider-b-body flex">
          <div class="slider-b-body__top">
            <div class="slider-b-body__title">
              The students <input type="text" placeholder="agree" /> they have too much homework.
            </div>
            <div class="slider-b-body__sub">Студенты согласны, что у них слишком много домашней работы</div>
          </div>
          <div class="slider-b-body__center">
            <div class="slider-b-body__show flex">
              <span>Показать объяснение значения слова</span>
              <img class="slider-b-body__accordionshow closeArrow" src="/assets/img/arrowDown.png" alt="1" />
            </div>
            <div class="slider-b-body__goshow opacity-0">
              <div class="slider-b-body__example">
                To <i>agree</i> is to have the same opinion or belief as another person.
              </div>
              <div class="slider-b-body__text">
                Согласиться - значит иметь то же мнение или убеждение, что и другой человек
              </div>
            </div>
          </div>
          <div class="slider-b-body__bottom flex">
            <div class="slider-b-body__get flex">
              <span
                >Добавить в<br />
                сложные слова</span
              ><label >
                  <input type="checkbox" class="custom-checkbox" name="happy" value="yes" />
                  <span></span>
              </label>
            </div>
            <div class="slider-b-body__more">
              <span>Agree - [əgríː] - согласна</span>
            </div>
          </div>
        </div>
      </div>`;
    sliderContainer.append(slide);
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
  }
}

const mainPage = new MainPage();

export default mainPage;

/* eslint-disable linebreak-style */
import {
  Swiper,
  Navigation,
  Keyboard,
  Pagination,
} from '../../../node_modules/swiper/js/swiper.esm';

Swiper.use([Navigation, Keyboard, Pagination]);

export default class RenderMainPage {
  constructor() {
    this.uncloseButton = document.getElementById('sidebarUncloseBtn');
    this.settingButton = document.getElementById('sidebarSettingBtn');
    this.volumeButton = document.getElementById('sidebarVolumeBtn');
    this.showTranslateButton = document.getElementById('showValueTranslate');
  }

  sidebarRender() {
    const items = document.querySelectorAll('.sidebar__item_link');
    this.uncloseButton.addEventListener('click', () => {
      this.uncloseButton.classList.toggle('sidebarUncloseBtn');
      items.forEach((e) => {
        e.classList.toggle('active');
      });
    });
  }

  settingButtonRender() {
    this.settingButton.addEventListener('click', () => {
      console.log('Ok');
    });
  }

  volumeButtonRender() {
    this.volumeButton.addEventListener('click', () => {
      console.log('Ok');
    });
  }

  showTranslateRender() {
    const valueTranslate = document.getElementById('valueTranslate');
    this.showTranslateButton.addEventListener('click', () => {
      console.log('ok');
      valueTranslate.classList.toggle('visible');
    });
  }

  init() {
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
        // totalClass: 'bar-block__numtwo',
        // currentClass: 'bar-block__numone',
      },
      // keyboard: {
      //   enabled: true,
      // },
      keyboard: true,
      loop: false,
      // onlyExternal: true,
      // allowSlidePrev: false,
      allowTouchMove: true,
    });
  }
}

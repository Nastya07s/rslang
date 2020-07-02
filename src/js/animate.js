import RenderMainPage from './RenderMainPage/RenderMainPage';

const render = new RenderMainPage();
render.init();

const toggleMenu = () => {
  document.querySelector('.menu').classList.toggle('menu__extended');
  document.querySelector('.openArrow').classList.toggle('closeArrow');
  document.querySelector('.menu__tеxtlogo').classList.toggle('d-none');

  document.querySelectorAll('.nav-menu__about').forEach((el) => {
    el.classList.toggle('d-none');
  });
  document.querySelectorAll('.opportunities-menu__about').forEach((el) => {
    el.classList.toggle('d-none');
  });
};

document.querySelector('.opportunities-menu__item-open').addEventListener('click', toggleMenu);

document
  .querySelectorAll('.opportunities-menu__item:first-child,.opportunities-menu__item:nth-child(2)')
  .forEach((el) => {
    el.addEventListener('click', () => {
      document.querySelector('.opportunities-menu__item-on').classList.toggle('d-none');
      document.querySelector('.opportunities-menu__item-off').classList.toggle('d-none');
    });
  });

document.querySelector('.menu__burger').addEventListener('click', ({ target }) => {
  target.closest('.menu__burger').classList.toggle('BurgerLock');
  document.querySelector('.menu__burger').classList.toggle('menu__burger-open');
  toggleMenu();
});

// document.querySelectorAll('.slider-block__info').forEach((el) => {
//   el.querySelector('.slider-b-body__show').addEventListener('click', () => {
//     el.querySelector('.slider-b-body__goshow').classList.toggle('opacity-0');
//     el.querySelector('.slider-b-body__accordionshow').classList.toggle('openArrow');
//     el.querySelector('.slider-b-body__accordionshow').classList.toggle('closeArrow');
//   });
// });

// document.querySelector('.lvl-block').addEventListener('click', ({ target }) => {
//   document.querySelectorAll('.lvl-block__item').forEach((el) => {
//     el.classList.remove('lvl-block__item-active');
//   });

//   target.closest('.lvl-block__item').classList.add('lvl-block__item-active');
// });

// document.querySelector('.bar-block__numone').textContent = render.mySwiper.realIndex + 1;
// document.querySelector('.bar-block__numtwo').textContent = render.mySwiper.slides.length;

// render.mySwiper.on('slideChange', () => {
//   document.querySelector('.bar-block__numone').textContent = render.mySwiper.realIndex + 1;
// });

// document.querySelector('.settings__logout').addEventListener('mousedown', ({ target }) => {
//   target.closest('.settings__logout').classList.add('settings__logout-active');
// });

// document.querySelector('.settings__logout').addEventListener('mouseup', ({ target }) => {
//   target.closest('.settings__logout').classList.remove('settings__logout-active');
// });

document.querySelector('.vocabulary__info').addEventListener('click', ({ target }) => {
  document.querySelectorAll('.vocabulary__info-title').forEach((el) => {
    el.classList.remove('vocabulary__info-title-active');
  });

  target.closest('.vocabulary__info-title').classList.add('vocabulary__info-title-active');
});

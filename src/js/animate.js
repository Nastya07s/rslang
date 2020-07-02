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

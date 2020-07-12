// import RenderMainPage from './RenderMainPage/RenderMainPage';

// const render = new RenderMainPage();
// render.init();

import settings from 'app/js/settings';
import mainPage from './mainPage';
import statisticsPage from './statisticsPage';
import vocabularyPage from './vocabularyPage';
import settingsPage from './settingsPage';

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
    el.addEventListener('click', async () => {
      document.querySelector('.opportunities-menu__item-on').classList.toggle('d-none');
      document.querySelector('.opportunities-menu__item-off').classList.toggle('d-none');
      await settings.getSettings();
      settings.isGlobalMute = document.querySelector('.opportunities-menu__item-on').classList.contains('d-none');
    });
  });

document.querySelector('.menu__burger').addEventListener('click', ({ target }) => {
  target.closest('.menu__burger').classList.toggle('BurgerLock');
  document.querySelector('.menu__burger').classList.toggle('menu__burger-open');
  toggleMenu();
});

document.querySelector('.main-page').addEventListener('click', (event) => {
  event.preventDefault();
  mainPage.init();
});

document.querySelector('.statistics-page').addEventListener('click', (event) => {
  event.preventDefault();
  statisticsPage.init();
});

document.querySelector('.settings-page').addEventListener('click', (event) => {
  event.preventDefault();
  settingsPage.init();
});

document.querySelector('.vocabulary-page').addEventListener('click', (event) => {
  event.preventDefault();
  vocabularyPage.init();
});

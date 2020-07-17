// import RenderMainPage from './RenderMainPage/RenderMainPage';

// const render = new RenderMainPage();
// render.init();

import settings from 'app/js/settings';
import mainPage from './mainPage';
import statisticsPage from './statisticsPage';
import vocabularyPage from './vocabularyPage';
import settingsPage from './settingsPage';
import store from './store';

const toggleMenu = () => {
  if (store.isRendered) {
    document.querySelector('.menu').classList.toggle('menu__extended');
    document.querySelector('.openArrow').classList.toggle('closeArrow');
    document.querySelector('.menu__tеxtlogo').classList.toggle('d-none');

    document.querySelectorAll('.nav-menu__about').forEach((el) => {
      el.classList.toggle('d-none');
    });
    document.querySelectorAll('.opportunities-menu__about').forEach((el) => {
      el.classList.toggle('d-none');
    });
  }
};

document.querySelector('.opportunities-menu__item-open').addEventListener('click', toggleMenu);

document
  .querySelectorAll('.opportunities-menu__item:first-child,.opportunities-menu__item:nth-child(2)')
  .forEach((el) => {
    el.addEventListener('click', async () => {
      if (store.isRendered) {
        document.querySelector('.opportunities-menu__item-on').classList.toggle('d-none');
        document.querySelector('.opportunities-menu__item-off').classList.toggle('d-none');
        // await settings.getSettings();
        await settings.update('isGlobalMute', document.querySelector('.opportunities-menu__item-on').classList.contains('d-none'));
        document.querySelectorAll('[data-settings=isGlobalMute]').forEach((sound) => {
          if (settings.isGlobalMute) sound.classList.remove('d-none');
          else sound.classList.add('d-none');
        });
      }
    });
  });

document.querySelectorAll('.nav-menu__item, .settings-page, .opportunities-menu__item-off, .opportunities-menu__item-on').forEach((item) => {
  item.addEventListener('click', () => {
    if (store.isRendered) {
      document.querySelector('.menu').classList.remove('menu__extended');
      document.querySelector('.openArrow').classList.remove('closeArrow');
      document.querySelector('.menu__tеxtlogo').classList.add('d-none');

      document.querySelectorAll('.nav-menu__about').forEach((el) => {
        el.classList.add('d-none');
      });
      document.querySelectorAll('.opportunities-menu__about').forEach((el) => {
        el.classList.add('d-none');
      });
    }
  });
});

document.querySelector('.menu__burger').addEventListener('click', ({ target }) => {
  if (store.isRendered) {
    target.closest('.menu__burger').classList.toggle('BurgerLock');
    document.querySelector('.menu__burger').classList.toggle('menu__burger-open');
    toggleMenu();
  }
});

document.querySelector('.main-page').addEventListener('click', async (event) => {
  event.preventDefault();
  if (store.isRendered) {
    await mainPage.init();
    store.isRendered = true;
  }
});

document.querySelector('.statistics-page').addEventListener('click', async (event) => {
  event.preventDefault();
  if (store.isRendered) {
    statisticsPage.init();
    store.isRendered = true;
  }
});

document.querySelector('.settings-page').addEventListener('click', async (event) => {
  event.preventDefault();
  if (store.isRendered) {
    await settingsPage.init();
    store.isRendered = true;
  }
});

document.querySelector('.vocabulary-page').addEventListener('click', async (event) => {
  event.preventDefault();
  if (store.isRendered) {
    await vocabularyPage.init();
    store.isRendered = true;
  }
});

/* eslint-disable no-restricted-globals */
import settings from 'app/js/settings';
import api from 'app/js/api';
import markup from './markup';
import store from './store';

class SettingsPage {
  constructor() {
    this.parent = document.querySelector('.wrapper');
  }

  async init() {
    store.isRendered = false;
    this.parent.innerHTML = markup.loader;

    this.render();
    this.initHandlers();
  }

  render() {
    this.parent.innerHTML = markup.settingsPage;

    console.log('settings: ', settings);
    this.parent.querySelectorAll('.settings__mode option').forEach(async (option) => {
      // const words = await api.getUserWords();
      const words = JSON.parse(localStorage.getItem('mainWords'));

      if (settings.learningMode === 'new' && option.value === 'new') {
        const countWords = words.filter((word) => !word.userWord).length;
        console.log('countWords: ', countWords);

        if (countWords && settings.countNewWords !== 0) {
          console.log(1);
          option.classList.remove('d-none');
        } else {
          option.classList.add('d-none');
          this.parent.querySelector('.settings__mode option[value=mix]').selected = true;
          settings.update('learningMode', 'mix');
        }
        console.log('option.classList: ', option.classList);
      }

      if (settings.learningMode === 'learning' && option.value === 'learning') {
        const countWords = words.filter((word) => word.userWord
          && word.userWord.optional.degreeOfKnowledge < 5).length;

        if (countWords) option.classList.remove('d-none');
        else option.classList.add('d-none');
      }

      if (settings.learningMode === 'old' && option.value === 'old') {
        const countWords = words.filter((word) => word.userWord
          && word.userWord.optional.degreeOfKnowledge === 5).length;

        if (countWords) option.classList.remove('d-none');
        else option.classList.add('d-none');
      }
    });

    this.parent.querySelectorAll('[data-settings]').forEach((el) => {
      const localEl = el;
      const value = settings[el.dataset.settings];
      if (+value) {
        localEl.checked = value;
      }
      localEl.value = value;
    });
  }

  initHandlers() {
    document.querySelector('.show-tooltip_btn').addEventListener('click', () => {
      localStorage.removeItem('tooltip');
      document.querySelector('.tooltip').style.display = 'flex';
      document.querySelector('.tooltip').classList.add('fade-in');
      setTimeout(() => {
        document.querySelector('.tooltip').classList.remove('fade-in');
      }, 500);
    });
    this.parent.querySelectorAll('.settings__logout').forEach((el) => el.addEventListener('mousedown', ({ target }) => {
      target.closest('.settings__logout').classList.add('settings__logout-active');
    }));

    this.parent.querySelectorAll('.settings__logout').forEach((el) => el.addEventListener('mouseup', ({ target }) => {
      target.closest('.settings__logout').classList.remove('settings__logout-active');
    }));

    this.parent.querySelector('.settings__logout:last-child').addEventListener('mouseup', () => {
      api.logoutUser();
      localStorage.removeItem('tooltip');
      localStorage.removeItem('mainWords');
      localStorage.removeItem('mainStatistics');
      window.location.href = '/';
    });

    this.parent.querySelectorAll('[data-settings]').forEach((el) => {
      el.addEventListener('change', async ({ target }) => {
        console.log('target.type: ', target.type);
        if (target.type === 'checkbox') {
          await settings.update(target.dataset.settings, target.checked);
          if (this.parent.querySelectorAll('.settings__item input:checked').length === 0) {
            this.parent.querySelector('.settings__item:nth-child(5) input').click();
          }
        } else if (target.type === 'number') {
          const inputs = this.parent.querySelectorAll('.settings__square-big');
          console.log('inputs: ', inputs);
          console.log('inputs[0].value: ', inputs[0].value);
          if (+inputs[0].value < 0) {
            inputs[0].value = 0;
          }
          if (+inputs[0].value === 0) {
            console.log(5);
            this.parent.querySelector('.settings__mode option[value=new]').classList.add('d-none');
            this.parent.querySelector('.settings__mode option[value=mix]').selected = true;
            settings.update('learningMode', 'mix');
          } else this.parent.querySelector('.settings__mode option[value=new]').classList.remove('d-none');
          if (+inputs[1].value < 1) inputs[1].value = 1;
          if (+inputs[0].value > 50) inputs[0].value = 50;
          if (+inputs[1].value > 50) inputs[1].value = 50;
          if (+inputs[0].value > +inputs[1].value) inputs[0].value = inputs[1].value;
          settings.update('countNewWords', +inputs[0].value);
          settings.update('wordsPerDay', +inputs[1].value);
        } else {
          settings.update(target.dataset.settings, target.value);
        }
      });
    });

    if (this.parent.querySelectorAll('.settings__item input:checked').length === 0) {
      this.parent.querySelector('.settings__item:nth-child(5) input').click();
    }

    this.parent.querySelectorAll('.settings__square-big').forEach((el) => {
      let init = true;
      el.addEventListener('focus', () => {
        if (init) {
          const isChange = confirm('Это действие приведет к сбросу дневной нормы. Вы уверены что хотите это сделать?');
          if (!isChange) {
            el.blur();
          }
          init = false;
        } else {
          localStorage.removeItem('mainStatistics');
          localStorage.removeItem('mainWords');
          init = true;
        }
      });
    });
  }
}

const settingsPage = new SettingsPage();

export default settingsPage;

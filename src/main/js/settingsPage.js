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

    this.parent.querySelectorAll('.settings__mode option').forEach(async (option) => {
      const words = await api.getUserWords();

      if (settings.learningMode === 'new' && option.value === 'new') {
        const countWords = words.filter((word) => !word.userWord).length;

        if (countWords) option.classList.remove('d-none');
        else option.classList.remove('d-none');
      }

      if (settings.learningMode === 'learning' && option.value === 'learning') {
        const countWords = words.filter((word) => word.userWord
          && word.userWord.optional.degreeOfKnowledge < 5).length;

        if (countWords) option.classList.remove('d-none');
        else option.classList.remove('d-none');
      }

      if (settings.learningMode === 'old' && option.value === 'old') {
        const countWords = words.filter((word) => word.userWord
          && word.userWord.optional.degreeOfKnowledge === 5).length;

        if (countWords) option.classList.remove('d-none');
        else option.classList.remove('d-none');
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
    this.parent.querySelector('.settings__logout').addEventListener('mousedown', ({ target }) => {
      target.closest('.settings__logout').classList.add('settings__logout-active');
    });

    this.parent.querySelector('.settings__logout').addEventListener('mouseup', ({ target }) => {
      target.closest('.settings__logout').classList.remove('settings__logout-active');
      api.logoutUser();
    });

    this.parent.querySelectorAll('[data-settings]').forEach((el) => {
      el.addEventListener('change', async ({ target }) => {
        if (target.type === 'checkbox') {
          await settings.update(target.dataset.settings, target.checked);
          if (this.parent.querySelectorAll('.settings__item input:checked').length === 0) {
            this.parent.querySelector('.settings__item:nth-child(5) input').click();
          }
        } else {
          const inputs = this.parent.querySelectorAll('.settings__square-big');
          if (inputs[0].value > inputs[1].value) inputs[0].value = inputs[1].value;
          settings.update('countNewWords', +inputs[0].value);
          settings.update('wordsPerDay', +inputs[1].value);
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

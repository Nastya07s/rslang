/* eslint-disable no-restricted-globals */
import settings from 'app/js/settings';
import api from 'app/js/api';
import markup from './markup';

class SettingsPage {
  constructor() {
    this.parent = document.querySelector('.wrapper');
  }

  async init() {
    // await settings.getSettings();
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
      el.addEventListener('change', ({ target }) => {
        if (target.type === 'checkbox') {
          settings.update(target.dataset.settings, target.checked);
        } else {
          const inputs = this.parent.querySelectorAll('.settings__square-big');
          console.log('inputs[0].value: ', inputs[0].value);
          console.log('inputs[1].value: ', inputs[1].value);
          if (inputs[0].value > inputs[1].value) inputs[0].value = inputs[1].value;
          settings.update('countNewWords', +inputs[0].value);
          settings.update('wordsPerDay', +inputs[1].value);
        }
      });
    });

    this.parent.querySelectorAll('.settings__square-big').forEach((el) => {
      let init = true;
      el.addEventListener('focus', () => {
        if (init) {
          const isChange = confirm('Это действие приведет к сбросу дневной нормы. Вы уверены что хотите это сделать?');
          console.log('isChange: ', isChange);
          if (!isChange) {
            //   el.focus();
            // } else {
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

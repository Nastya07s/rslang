import settings from 'app/js/settings';
import api from 'app/js/api';
import markup from './markup';

class SettingsPage {
  constructor() {
    this.parent = document.querySelector('.wrapper');
  }

  async init() {
    await settings.getSettings();
    this.render();
    this.initHandlers();
  }

  render() {
    this.parent.innerHTML = markup.settingsPage;

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
          settings.update(target.dataset.settings, target.value);
        }
      });
    });
  }
}

const settingsPage = new SettingsPage();

export default settingsPage;

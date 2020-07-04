import markup from './markup';
import api from './api';

class SettingsPage {
  constructor() {
    this.parent = document.querySelector('.wrapper');
  }

  init() {
    this.render();
    this.initHandlers();
    this.getSettings();
  }

  render() {
    this.parent.innerHTML = markup.settingsPage;
  }

  initHandlers() {
    this.parent.querySelector('.settings__logout').addEventListener('mousedown', ({ target }) => {
      target.closest('.settings__logout').classList.add('settings__logout-active');
    });

    this.parent.querySelector('.settings__logout').addEventListener('mouseup', ({ target }) => {
      target.closest('.settings__logout').classList.remove('settings__logout-active');
    });
  }

  async getSettings() {
    this.parent = document.querySelector('.wrapper');
    const data = await api.getSettings();
    console.log('data: ', data);
    return data;
  }
}

const settingsPage = new SettingsPage();

export default settingsPage;

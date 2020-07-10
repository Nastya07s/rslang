import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './scss/main.scss';

import Api from 'app/js/api';
import Settings from 'app/js/settings';
import state from './js/state';
import englishPuzzle from './js/englishpuzzle';


const api = Api;
api.checkLogin()
  .then(async () => {
    const settings = Settings;
    await settings.getSettings();
    englishPuzzle.init(state, api, settings);
  }, () => {
    window.location.href = '/';
  });

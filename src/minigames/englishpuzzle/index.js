import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './scss/main.scss';

import api from 'app/js/api';
import settings from 'app/js/settings';
import state from './js/state';
import englishPuzzle from './js/englishpuzzle';


api.checkLogin()
  .then(async () => {
    await api.loginUser({ email: 'gabrielljihk@gmail.com', password: 'AAaaBBbb12!' });
    await settings.getSettings();
    englishPuzzle.init(state, api, settings);
  }, () => {
    window.location.href = '/';
  });

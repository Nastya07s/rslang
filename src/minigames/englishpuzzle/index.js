import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './scss/main.scss';

import Api from 'app/js/api';
import Settings from 'app/js/settings';
import state from './js/state';
import englishpuzzle from './js/englishpuzzle';


const api = Api;
const settings = new Settings();
englishpuzzle.init(state, api, settings);

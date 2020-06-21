import 'core-js/stable';
import 'regenerator-runtime/runtime';

import './js/main';
import './scss/main.scss';
import Login from './js/login';
import Registration from './js/registration';

const login = new Login('#login');
const registration = new Registration('#registration');
// eslint shows errors without console.log (no-unused-vars)
console.log(login);
console.log(registration);

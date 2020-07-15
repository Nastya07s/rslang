import 'core-js/stable';
import 'regenerator-runtime/runtime';

import Login from 'app/js/login';
import promoPage from './promo';

import Registration from './registration';

const login = new Login('#login');
const registration = new Registration('#registration');
// eslint shows errors without console.log (no-unused-vars)
console.log(login);
console.log(registration);

promoPage.initPromo();

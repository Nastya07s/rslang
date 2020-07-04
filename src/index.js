import 'core-js/stable';
import 'regenerator-runtime/runtime';

import './scss/main.scss';
import './js/main';
import './js/animate';

// import '../../node_modules/swiper/swiper.min.scss';

import settingsPage from './js/settingsPage';
import api from './js/api';

// const example = new StatisticsPage();
// console.log(example);
// const api = new Api();
const login = async () => {
  const data = await api.loginUser({ email: 'test3@mail.ru', password: 'QQQwww123.' });
  console.log('data: ', data);
  settingsPage.init();
  return data;
};
login();

// });

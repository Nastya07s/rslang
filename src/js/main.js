import 'app/index';
import 'app/scss/main.scss';
import './animate';

import mainPage from './mainPage';
import api from './api';

api.loginUser({ email: 'test3@mail.ru', password: 'QQQwww123.' }).then(() => {
  mainPage.init();
});

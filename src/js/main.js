import 'app/index';
import 'app/scss/main.scss';
import './animate';

import settingsPage from './settingsPage';
import api from './api';

api.loginUser({ email: 'test3@mail.ru', password: 'QQQwww123.' }).then(() => {
  settingsPage.init();
});

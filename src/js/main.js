import 'app/index';
import 'app/scss/main.scss';
import './animate';

import vocabularyPage from './vocabularyPage';
import api from './api';

api.loginUser({ email: 'test3@mail.ru', password: 'QQQwww123.' }).then(() => {
  vocabularyPage.init();
});

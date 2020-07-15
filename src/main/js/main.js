import 'app/index';
import 'app/main/scss/main.scss';
import api from 'app/js/api';
import './animate';
import mainPage from './mainPage';
import tooltip from './tooltip';

api.checkLogin().then(async (user) => {
  mainPage.init();
  tooltip.init();
  console.log(user);
}, () => {
  console.log('Couldnt login');
});

// api.loginUser({ email: 'test3@mail.ru', password: 'QQQwww123.' }).then(() => {
//   mainPage.init();
// });

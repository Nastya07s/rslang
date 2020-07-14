import 'app/index';
import '../scss/main.scss';
import api from 'app/js/api';
import './animate';
import mainPage from './mainPage';

api.checkLogin().then((user) => {
  console.log('AUTHORIZED as', user);
  mainPage.init();
}, () => {
  console.log('UNAUTHORIZED');
});

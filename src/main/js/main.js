import 'app/index';
import 'app/scss/main.scss';
import api from 'app/js/api';
import './animate';
import mainPage from './mainPage';

api.loginUser({ email: 'gabrielljihk@gmail.com', password: 'AAaaBBbb12!' }).then(() => {
  mainPage.init();
});

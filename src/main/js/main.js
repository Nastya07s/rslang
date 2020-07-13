import 'app/index';
import 'app/main/scss/main.scss';
import api from 'app/js/api';
import './animate';
import mainPage from './mainPage';

api.loginUser({ email: 'gabrielljihk@gmail.com', password: 'AAaaBBbb12!' }).then(() => {
  mainPage.init();
});

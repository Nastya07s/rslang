import 'app/index';
import 'app/main/scss/main.scss';
import api from 'app/js/api';
import './animate';
import mainPage from './mainPage';
import tooltip from './tooltip';

api.loginUser({ email: 'gabrielljihk@gmail.com', password: 'AAaaBBbb12!' }).then(() => {
  tooltip.init();
  mainPage.init();
});

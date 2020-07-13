import 'app/index';
import 'app/scss/main.scss';
import api from 'app/js/api';
import Login from 'app/js/login';
import Registration from 'app/js/registration';
import './animate';
import mainPage from './mainPage';
// import './js/main';
// import './scss/main.scss';

const login = new Login('#login');
const registration = new Registration('#registration');
// eslint shows errors without console.log (no-unused-vars)
console.log(login);
console.log(registration);

api.loginUser({ email: 'test3@gmail.com', password: 'AAbb1234!' }).then(() => {
  mainPage.init();
});

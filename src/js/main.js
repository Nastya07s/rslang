import Api from './api';

const api = new Api();

api.checkLogin().then((user) => {
  // Already logged in
  console.log(user);
}, () => {
  // Redirect to login
});

const login = document.querySelectorAll('.switcher-login');
const signup = document.querySelectorAll('.switcher-signup');

const wrapperLogin = document.querySelector('.box-login');
const wrapperSignup = document.querySelector('.box-signup');

signup.forEach((el) => {
  el.addEventListener('click', () => {
    wrapperLogin.classList.remove('is-active');
    wrapperSignup.classList.add('is-active');
  });
});

login.forEach((el) => {
  el.addEventListener('click', () => {
    wrapperSignup.classList.remove('is-active');
    wrapperLogin.classList.add('is-active');
  });
});

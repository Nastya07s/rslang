import Api from './api';

const api = new Api();

api.checkLogin().then((user) => {
  // Already logged in
  console.log(user);
}, () => {
  // Redirect to login
});

const switchers = [...document.querySelectorAll('.switcher')];

switchers.forEach((item) => {
  item.addEventListener('click', function () {
    switchers.forEach((items) => items.parentElement.classList.remove('is-active'));
    this.parentElement.classList.add('is-active');
  });
});

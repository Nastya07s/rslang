import Api from './api';

const api = new Api();

api.checkLogin().then(() => {
  // Already logged in
  // console.log(user);
}, () => {
  // Redirect to login
});

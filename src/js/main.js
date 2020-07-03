import Api from './api';
import promoPage from './promo';

const api = new Api();

api.checkLogin().then((user) => {
  // Already logged in
  console.log(user);
}, () => {
  // Redirect to login
});

promoPage.initPromo();

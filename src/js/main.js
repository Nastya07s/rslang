import api from './api';
import promoPage from './promo';

api.checkLogin().then((user) => {
  // Already logged in
  console.log(user);
}, () => {
  // Redirect to login
});

promoPage.initPromo();

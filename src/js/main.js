import 'app/index';
import promoPage from './promo';
import Login from './login';
import Registration from './registration';

const login = new Login();
const registration = new Registration();
// eslint shows errors without console.log (no-unused-vars)
console.log(login);
console.log(registration);

promoPage.initPromo();

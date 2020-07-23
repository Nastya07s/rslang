import 'app/index';
import Login from './login';
import Registration from './registration';
import promoPage from './promo';

const login = new Login();
const registration = new Registration();
// eslint shows errors without console.log (no-unused-vars)
console.log(login);
console.log(registration);

promoPage.initPromo();

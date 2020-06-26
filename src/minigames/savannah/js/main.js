import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Api from '../../../js/api';
import Controller from './controller/Controller';
import View from './view/View';
import Model from './model/Model';

/* eslint no-console: "off" */

const api = new Api();
(async () => {
  try {
    const res = await api.checkLogin();
    console.log(res);
    // const data = res.json();
    // console.log(data);
  } catch (e) {
    console.log(e);
  }
})();

// const api = new Api();
(async () => {
  try {
    const res = await api.loginUser({ email: 'testmail5@mail.ru', password: '$wVgg123' });
    console.log(res);
    // const data = res.json();
    // console.log(data);
  } catch (e) {
    console.log(e);
  }
})();


const app = new Controller(new Model(), new View());
app.init();


// loginUser({ email: 'testmail5@mail.ru', password: '$wVgg123' });

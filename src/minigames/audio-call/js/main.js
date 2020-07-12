import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Api from '../../../js/api';
import Controller from './controller/Controller';
import View from './view/View';
import Model from './model/Model';

/* eslint no-console: "off" */

(async () => {
  try {
    // Api.
    // console.log(Api);
    // testmail5@mail.ru
    // $wVgg123

    // test-user@mail.ru
    // $wVgg123
    await Api.checkLogin();
    // await Api.loginUser({ email: 'test-user@mail.ru', password: '$wVgg123' });
    const app = new Controller(new Model(), new View());
    app.init();
  } catch (e) {
    console.log(e);
    window.location.href = '/';
  }
})();

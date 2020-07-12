import Api from '../../../js/api';
import Controller from './controller/Controller';
import View from './view/View';
import Model from './model/Model';

/* eslint no-console: "off" */

(async () => {
  try {
    // testmail5@mail.ru
    // $wVgg123

    // test-user@mail.ru
    // $wVgg123
    // await Api.loginUser({ email: 'test-user@mail.ru', password: '$wVgg123' });

    await Api.checkLogin();
    // console.log(check);
    // const res = await api.loginUser({ email: 'testmail5@mail.ru', password: '$wVgg123' });
    // console.log(res);
    const app = new Controller(new Model(), new View());
    app.init();
  } catch (e) {
    console.log(e);
    window.location.href = '/';
  }
})();

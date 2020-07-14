import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Api from '../../../js/api';
import Controller from './controller/Controller';
import View from './view/View';
import Model from './model/Model';

/* eslint no-console: "off" */

(async () => {
  try {
    await Api.checkLogin();
    const app = new Controller(new Model(), new View());
    app.init();
  } catch (e) {
    console.log(e);
    // window.location.href = '/';
  }
})();

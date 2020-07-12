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
    // testmail5@mail.ru
    // $wVgg123

    // test-user@mail.ru
    // $wVgg123
    await api.loginUser({ email: 'test-user@mail.ru', password: '$wVgg123' });

    await api.checkLogin();
    // console.log(check);
    // const res = await api.loginUser({ email: 'testmail5@mail.ru', password: '$wVgg123' });
    // console.log(res);
    const app = new Controller(new Model(), new View());
    app.init();
    // const data = res.json();
    // console.log(data);
  } catch (e) {
    console.log(e);
    window.location.href = '/';
  }
})();


// (async () => {
//   try {
//     const words = await api.getUserWords();
//     console.log(words);
//     Object.keys(words).forEach(async (element) => {
//       await api.deleteUserWord(words[element].wordId);
//     });
//   } catch (e) {
//     // window.location.href = '/';
//     console.log(e);
//   }
// })();

// test
// (async () => {
//   try {
//     const param = {
//       group: 5,
//       wordsPerPage: 20,
//       filter: {
//         $and: [
//           { page: 0 },
//         ],
//       }
//     }
//     const words = await api.getUsersAggregatedWords1(param);
//     console.log(words);
//     // Object.keys(words).forEach(async (element) => {
//     //   await api.deleteUserWord(words[element].wordId);
//     // });
//   } catch (e) {
//     // window.location.href = '/';
//     console.log(e);
//   }
// })();

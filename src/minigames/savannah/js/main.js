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
//   let words = await api.getUsersAggregatedWords(20, { "$and": [{ "userWord": null }] });
//   console.log('words =  ', words);
// })();


// (async () => {
//   try {
//     const words = await api.getUserWords();
//     console.log(words);

//     // for (let word in words) {
//     //   word.difficulty = 3;
//     //   word.optional.isHard = false;
//     //   word.optional.isDelete = false;
//     //   word.optional.isReadyToRepeat = false;
//     //   word.optional.countRepetition = 0;
//     //   word.optional.isHard = false;
//     //   word.optional.lastRepetition = 1593727401459;
//     //   const d = word.difficulty;
//     //   const o = word.optional;
//     //   await api.updateUserWordById(word.wordId, { d, o });
//     //   // console.log(word);
//     // }

//     // words.forEach(async (element) => {
//     //   element.difficulty = "3";
//     //   element.optional.isHard = false;
//     //   element.optional.isDelete = false;
//     //   element.optional.isReadyToRepeat = false;
//     //   element.optional.countRepetition = 4;
//     //   element.optional.isHard = false;
//     //   element.optional.lastRepetition = 1593727401459;
//     //   const difficulty = element.difficulty;
//     //   const optional = element.optional;
//     //   await api.updateUserWordById(element.wordId, { difficulty, optional });
//     //   console.log(element);
//     // });

//     // delete
//     // for (const key in words) {
//     //   await api.deleteUserWord(words[key].wordId);
//     //   // console.log(words[key].wordId);
//     // }
//     Object.keys(words).forEach(async (element) => {
//       await api.deleteUserWord(words[element].wordId);
//     });
//     // const test = await api.deleteUserWord(element.id);
//     // const app = new Controller(new Model(), new View());
//   } catch (e) {
//     // window.location.href = '/';
//     console.log(e);
//   }
// })();

// "difficulty": "3",
//           "optional": {
//             "isHard": "false",
//             "isDelete": "false",
//             "isReadyToRepeat": "false",
//             "countRepetition": "1",
//             "lastRepetition": 1593727401459
//           }


// {
//   "id": "5eecc1848f6073001781857d",
//   "difficulty": "0",
//   "optional": {
//     "countRepetition": 10,
//     "isDelete": false,
//     "isHard": true,
//     "isReadyToRepeat": false,
//     "lastRepetition": 1590896255592,
//     "degreeOfKnowledge": 4
//   },
//   "wordId": "5e9f5ee35eb9e72bc21af4a1"
// }

// // const api = new Api();


// app.init();
// app.init();
// // app

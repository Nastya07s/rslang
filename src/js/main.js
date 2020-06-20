import Api from './api';
import EnglishPuzzle from './EnglishPuzzle';

const api = new Api();

api.checkLogin().then((user) => {
  // Already logged in
  console.log(user);
}, () => {
  // Redirect to login
});

const englishPuzzle = new EnglishPuzzle(api);
console.log(englishPuzzle);

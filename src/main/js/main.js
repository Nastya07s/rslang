import 'app/index';
import '../scss/main.scss';
import api from 'app/js/api';
import './animate';
import mainPage from './mainPage';
// import GlobalStatistics from '../components/global-statistics';

api.checkLogin().then(async (user) => {
  console.log('AUTHORIZED as', user);
  mainPage.init();

  // const globalStats = new GlobalStatistics({
  //   element: document.body,
  // });

  // await globalStats.init();
  // globalStats.showStatistics();
}, () => {
  console.log('UNAUTHORIZED');
});

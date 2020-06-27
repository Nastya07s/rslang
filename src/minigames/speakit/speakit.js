import './speakit.scss';

import Api from 'app/js/api';
import Settings from 'app/js/settings';

import loader from 'app/js/loader';
import PageIntro from './components/page-intro/page-intro';

// 1. Check login
const api = new Api();

api.checkLogin().then(async (user) => {
  // Already logged in
  console.log(user);

  // 2. Get settings
  const settings = new Settings();

  await settings.getSettings();
  console.log(JSON.stringify(settings));

  // settings.update('learningWordsMode', 'learning');

  // 3. Start render of the page
  const pageIntro = new PageIntro({
    settings,
  });

  // Be sure that background image is loaded
  await pageIntro.init();
  // Prevent fonts blinking
  await document.fonts.ready;

  // Page Intro is loaded
  pageIntro.elements.root.classList.toggle('visually-hidden');
  loader.toggle();
}, () => {
  // Redirect to login
  window.location.href = '/';
});

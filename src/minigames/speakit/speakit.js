import './speakit.scss';

import Settings from 'app/js/settings';
import loader from 'app/js/loader';
import PageIntro from './components/page-intro/page-intro';

const pageIntro = new PageIntro({
  // rootClassName: 'page-intro',
});

pageIntro.init();

// Get settings
const settings = new Settings();

Promise.all([settings.getSettings()]);

// Prevent fonts blinking & to be sure that background image is loaded
window.onload = () => {
  console.log('FONTS LOADED');

  pageIntro.elements.root.classList.toggle('visually-hidden');
  loader.toggle();
};

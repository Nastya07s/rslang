import './speakit.scss';

import loader from 'app/js/loader';
import PageIntro from './components/page-intro/page-intro';

loader.toggle();

const pageIntro = new PageIntro({
  // rootClassName: 'page-intro',
});

pageIntro.init();

// Prevent fonts blinking & to be sure that background image is loaded
window.onload = () => {
  console.log('FONTS LOADED');
  loader.toggle();
};

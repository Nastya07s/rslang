import 'core-js/stable';
import 'regenerator-runtime/runtime';

import Sprint from './sprint';
import './sprint.scss';

const sprint = new Sprint('#minigame-sprint');
// eslint shows errors without console.log (no-unused-vars)
console.log(sprint);

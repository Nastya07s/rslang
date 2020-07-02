import markup from './markup';

export default class StatisticsPage {
  constructor() {
    this.parent = document.querySelector('.wrapper');
    this.init();
  }

  init() {
    this.render();
    // this.initHandlers();
  }

  render() {
    this.parent.innerHTML = markup.statisticsPage;
  }

  // initHandlers() {
  // }
}

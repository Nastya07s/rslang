import markup from './markup';

class StatisticsPage {
  constructor() {
    this.parent = document.querySelector('.wrapper');
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

const statisticsPage = new StatisticsPage();

export default statisticsPage;

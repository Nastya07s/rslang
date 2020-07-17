import markup from './markup';
import GlobalStatistics from '../components/global-statistics';
import store from './store';

class StatisticsPage {
  constructor() {
    this.elements = {};
    this.classes = {
      ROOT: 'wrapper',
      STATISTICS: 'statistics',
      STATISTICS_GRAPH: 'statistics__graph',
    };
    [this.parent] = document.getElementsByClassName(this.classes.ROOT);
  }

  async init() {
    store.isRendered = false;

    const { STATISTICS } = this.classes;
    const isAlreadyRendered = [...this.parent.children]
      .find((child) => child.classList.contains(STATISTICS));

    if (isAlreadyRendered) {
      return;
    }

    this.render();
    this.initElements(); // Find HTML elements by their classNames
    // this.initHandlers(); // Add event listeners on the initialized stateful elements

    const { statisticsGraph } = this.elements;

    const globalStats = new GlobalStatistics({
      element: statisticsGraph,
    });

    await globalStats.init();
    globalStats.showStatistics();
  }

  render() {
    const fragment = new DocumentFragment();
    const template = document.createElement('template');

    template.innerHTML = markup.statisticsPage;

    fragment.append(template.content);
    this.parent.children.forEach((child) => {
      child.remove();
    });
    this.parent.append(fragment);
  }

  initElements() {
    const { parent } = this;
    const {
      STATISTICS_GRAPH,
    } = this.classes;
    const [statisticsGraph] = parent.getElementsByClassName(STATISTICS_GRAPH);

    this.elements = {
      ...this.elements,
      statisticsGraph,
    };
  }

  // initHandlers() {
  //   const { statisticsGraph } = this.elements;

  // }
}

const statisticsPage = new StatisticsPage();

export default statisticsPage;

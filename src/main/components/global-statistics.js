import CanvasJS from 'app/js/libs/canvasjs.min';
import PopUp from 'speakit/components/pop-up/pop-up';
import WordsGlobalStatistics from '../helpers/words';

const log = (...params) => {
  console.log('||| ', ...params);
};

class GlobalStatistics {
  constructor(props = { element: document.body }) {
    this.elements = {
      parent: props.element,
    };
    this.classes = {
      ROOT: 'global-stats',
      MESSAGE: 'global-stats__message',
    };
    this.chart = null;
    this.countLearnedWords = null;
    this.countWords = null;
    this.data = null;
  }

  async init() {
    this.render(); // Render markup
    this.initElements(); // Find HTML elements by their classNames
    // await this.initHandlers(); // Add event listeners on the initialized stateful elements

    const isInitDataSuccessful = await this.initData();

    if (!isInitDataSuccessful) {
      return false;
    }

    this.initChart({
      title: `Всего выучено: ${this.countLearnedWords} из ${this.countWords} слов`,
      dataset: this.chartData,
    });

    return true;
  }

  render() {
    const fragment = new DocumentFragment();
    const template = document.createElement('template');

    template.innerHTML = `
      <div class="global-stats">
        <div id="chartContainer" class="global-stats__wrapper" style="height: 100%;
        width: 100%;">
          <div class="global-stats__message"><p>Статистика загружается...</p></div>
        </div>
      </div>
    `;

    const root = template.content.firstElementChild;

    this.elements = {
      ...this.elements,
      root,
    };

    fragment.append(template.content);
    this.elements.parent.append(fragment);
  }

  initElements() {
    const { root } = this.elements;
    const {
      MESSAGE,
    } = this.classes;
    const [messageBlock] = root.getElementsByClassName(MESSAGE);

    this.elements = {
      ...this.elements,
      messageBlock,
    };
  }

  // async initHandlers() {
  //   const {
  //     // root,
  //     closeButton,
  //   } = this.elements;

  //   closeButton.addEventListener('click', () => {
  //     window.location.href = '/main';
  //   });
  // }

  async initData() {
    this.countWords = await WordsGlobalStatistics.getTotalCountWords();
    this.countLearnedWords = await WordsGlobalStatistics.getTotalCountLearnedWords();
    this.data = await WordsGlobalStatistics.getLearnedWords();

    this.chartData = GlobalStatistics.processChartData(this.data);

    if (!this.chartData) {
      const title = 'Статистика недоступна.';
      const subtitle = 'Недостаточно данных для построения графика.';
      const description = 'Учитесь, играйте и выучивайте английские слова и возвращайтесь сюда позже :)';

      this.showChartMessage(`${title}\n${subtitle}\n${description}`);

      const popUp = new PopUp({
        element: document.body,
        title: `${title} ${subtitle}`,
        description,
        handlerExitButton: () => { popUp.toggle(); },
        handlerCancelButton: () => {},
        type: 'info',
      });

      popUp.toggle();

      return false;
    }

    return true;
  }

  // static processChartData() {
  static processChartData(data) {
    // const sourceArray = [
    //   { x: new Date(1999, 5, 10), y: 3289000 },
    //   { x: new Date(2000, 0, 1), y: 3289000 },
    //   // { x: new Date(2020, 0, 2), y: 3289000 },
    //   { x: new Date(2000, 0, 2), y: 3830000 },
    //   { x: new Date(2000, 0, 2), y: 2009000 },
    //   { x: new Date(2000, 3), y: 2840000 },
    //   { x: new Date(2000, 4), y: 2396000 },
    //   { x: new Date(2000, 5), y: 100 },
    //   // { x: new Date(2020, 0, 30), y: 3289000 },
    //   { x: new Date(2000, 6), y: 2821000 },
    //   { x: new Date(2000, 7), y: 2000000 },
    //   { x: new Date(2000, 8), y: 1397000 },
    //   { x: new Date(2000, 9), y: 2506000 },
    //   { x: new Date(2000, 10), y: 2798000 },
    //   { x: new Date(2000, 11), y: 3386000 },
    // ];
    // const processedDates = sourceArray.map(({ x }) => x);

    const currentYear = new Date().getFullYear();
    const getDates = (word) => {
      const { userWord: { optional: { becameLearned: timestamp } } } = word;

      return new Date(timestamp);
    };
    const processedDates = data.map(getDates);
    const sortedDatesByAscendingOrder = processedDates.sort((a, b) => a.getTime() - b.getTime());
    const filteredByCurrentYearDates = sortedDatesByAscendingOrder.filter((date) => {
      const year = date.getFullYear();
      const isCurrentYear = year === currentYear;

      return isCurrentYear;
    });

    const isEnoughDataToDrawChart = filteredByCurrentYearDates.length >= 2;

    if (!isEnoughDataToDrawChart) {
      return false;
    }

    // Получаем количество слов, которое было изучено до текущего года
    const [firstDate] = filteredByCurrentYearDates;
    const wordsCountBeforeFirstDate = 1 + sortedDatesByAscendingOrder.findIndex((date) => {
      const isTheSameDateWithFirstFilteredDate = date === firstDate;

      return isTheSameDateWithFirstFilteredDate;
    });
    const formattedData = filteredByCurrentYearDates.map((date, index) => {
      const learnedWordsCountByCurrentDate = wordsCountBeforeFirstDate + index;

      return {
        x: date,
        y: learnedWordsCountByCurrentDate,
      };
    });

    console.log(formattedData);

    return formattedData;
  }

  initChart(data = {}, shouldRender = true) {
    const fontFamily = 'Montserrat, sans-serif';
    const fontSize = 12;
    const fontWeight = 400;
    const datasetColor = 'rgba(54, 158, 173, 0.7)';

    const axisOptions = {
      labelFontFamily: fontFamily,
      labelFontSize: fontSize,

      titleFontFamily: fontFamily,
      titleFontSize: fontSize + 2,
      titleFontWeight: fontWeight,
    };

    const { title, dataset } = data;

    this.chart = new CanvasJS.Chart('chartContainer', {
      animationEnabled: true,
      zoomEnabled: true,
      culture: 'ru',
      title: {
        text: title,
        padding: 10,
        fontFamily,
        fontSize: 18,
      },
      subtitles: [{
        text: '*график можно приближать и растягивать',
        fontFamily,
        fontSize: 12,
        horizontalAlign: 'right',
        padding: 0,
      }],
      axisX: {
        title: 'По дням',
        valueFormatString: 'D, MMM',
        margin: 0,
        intervalType: 'month',

        ...axisOptions,
      },
      axisY: {
        title: 'Количество изученных слов',
        valueFormatString: '###',
        margin: 10,

        ...axisOptions,
      },
      data: [
        {
          type: 'splineArea',
          padding: 10,
          color: datasetColor,
          markerSize: 3,
          toolTipContent: '{x}<br/>Изучено {y}',
          xValueFormatString: 'D MMMM YYYY, HH:MM',
          yValueFormatString: '#',
          dataPoints: dataset,
        },
      ],
    });

    if (shouldRender) {
      this.chart.render();
    }
  }

  showStatistics() {
    log(`Всего слов: ${this.countWords}`, `Выучено: ${this.countLearnedWords}`);
    log('Запрос всех слов', this.data);
  }

  showChartMessage(message) {
    let {
      messageBlock,
    } = this.elements;

    if (!messageBlock) {
      const { root } = this.elements;

      messageBlock = document.createElement('div');
      messageBlock.classes = 'global-stats__message';

      const messageTextBlock = document.createElement('p');

      messageBlock.append(messageTextBlock);
      root.firstElementChild.append(messageBlock);
    }

    messageBlock.firstElementChild.textContent = message;
  }
}

export default GlobalStatistics;

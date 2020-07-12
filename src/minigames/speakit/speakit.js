import 'app/index';
import './speakit.scss';

import EventBus from 'app/js/utils/eventBus';
import api from 'app/js/api';
import settings from 'app/js/settings';
import Statistics from 'app/js/statistics';

import loader from 'app/js/utils/loader';
import performRequests from 'app/js/utils/perform-requests';
import PageIntro from './components/page-intro/page-intro';
import PageMain from './components/page-main/page-main';
import StatisticsModal from './components/statistics-modal/statistics-modal';
import PageOutro from './components/page-outro/page-outro';

// 0. Create instance of Event Bus (some design pattern also called Observer)
const eventBus = new EventBus();

// 1. Check login
api.checkLogin().then(async (user) => {
  // Already logged in
  console.log(user);

  // Settings subscribers
  eventBus.subscribe('settings.update', (...data) => settings.update(...data));

  // 2.1. Get settings
  await settings.getSettings();

  // settings.minigames.speakit.isMute = true;
  // await eventBus.emit('settings.update', 'speakit', settings.minigames.speakit);

  // console.log(JSON.stringify(settings));

  // const { minigames: { speakit } } = settings;

  // speakit.difficulty = 4;

  // await settings.update('speakit', speakit);
  // await settings.update('learningMode', 'mix');

  console.log(JSON.stringify(settings));

  // 2.2. Init Statistics
  const statistics = new Statistics();

  eventBus.subscribe('statistics.update', (...data) => {
    performRequests([statistics.updateGameResult.bind(statistics, 'speakit', ...data)]);
  });

  // 3. Start render of the page
  const pageIntro = new PageIntro({ eventBus });

  // Intro Page subscribers
  eventBus.subscribe('pageIntro.startGame', async (data) => {
    const { isMixMode } = data;
    const {
      minigames: {
        speakit: {
          isMute,
          round,
          difficulty,
        },
      },
    } = settings;
    const pageMain = new PageMain({
      eventBus,
      round: isMixMode ? round : -1, // -1 detects that we need to use another mode
      difficulty: isMixMode ? difficulty : -1, // -1 detects that we need to use another mode
      volume: isMute ? 0 : 1,
    });

    const destruct = () => {
      eventBus.unsubscribe('pageMain.destruct', destruct);
      pageMain.elements.root.remove();
    };

    eventBus.subscribe('pageMain.destruct', destruct);

    await pageMain.init();
  });
  eventBus.subscribe('pageMain.ready', () => { pageIntro.hide(); });
  eventBus.subscribe('statistics.show', (data) => {
    console.log('Stasistics will be shown');
    const {
      element,
      words,
      volume,
    } = data;

    console.log(words);
    const statisticsModal = new StatisticsModal({
      element,
      data: words,
      volume,
      handlerStartButton: async () => {
        const { callback } = data;
        const mainPageInitParams = await callback();

        statisticsModal.toggle();
        statisticsModal.elements.root.onanimationend = () => {
          eventBus.emit('pageOutro.destruct');
          statisticsModal.elements.root.remove();
          statisticsModal.elements.root.onanimationend = null;
        };

        await eventBus.emit('pageIntro.startGame', {
          ...mainPageInitParams,
        });
      },
      handlerCloseButton: () => {
        document.location.href = '/main';
      },
    });

    eventBus.subscribe('audioVolumeChanged', (volumeNumber) => {
      statisticsModal.changeVolume(volumeNumber);
    });

    statisticsModal.init();
    statisticsModal.toggle();
  });

  // Outro subscribers
  eventBus.subscribe('pageOutro.init', async (data) => {
    // const { callback } = data;
    const pageOutro = new PageOutro({ eventBus });

    const outroDestruct = () => {
      console.log('Outro destructuring');
      pageOutro.elements.root.remove();
      eventBus.unsubscribe('pageOutro.destruct', outroDestruct);
    };

    eventBus.subscribe('pageOutro.destruct', outroDestruct);
    eventBus.emit('pageMain.destruct');
    await pageOutro.init();
    // Prevent fonts blinking
    await document.fonts.ready;

    // Page Outro is loaded
    pageOutro.show();
    pageOutro.showStatistics(data);
  });

  // Be sure that background image is loaded
  await pageIntro.init();

  // Prevent fonts blinking
  await document.fonts.ready;

  // Page Intro is loaded
  pageIntro.show();
  loader.toggle();
}, () => {
  // Redirect to login
  window.location.href = '/';
});

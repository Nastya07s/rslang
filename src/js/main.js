import Api from './api';
import Settings from './settings';

// 1. Check login
const api = new Api();

api.checkLogin().then(async (user) => {
  // Already logged in
  console.log(user);

  // 2. Get settings
  const settings = new Settings();

  await settings.getSettings(); // get settings from backend & set them to the instance of Settings
  // await settings.initSettings(); // use this for first initialization of the new user
  console.log(JSON.stringify(settings)); // see what is stored in settings instance

  // Example of how update some field of the minigame
  // const { minigames: { speakit } } = settings;

  // speakit.difficulty = 4;

  // await settings.update('speakit', speakit);

  // Example of how update learningMode field
  // await settings.update('learningMode', 'mix');
}, () => {
  // Redirect to login
  // window.location.href = '/';
});

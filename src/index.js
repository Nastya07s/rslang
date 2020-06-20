import './js/main';
import './scss/main.scss';
import RenderMainPage from './js/RenderMainPage/RenderMainPage';

const renderMainPage = new RenderMainPage();
renderMainPage.sidebarRender();
renderMainPage.settingButtonRender();
renderMainPage.volumeButtonRender();

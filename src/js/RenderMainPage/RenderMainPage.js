export default class RenderMainPage {
  constructor() {
    this.uncloseButton = document.getElementById('sidebarUncloseBtn');
    this.settingButton = document.getElementById('sidebarSettingBtn');
    this.volumeButton = document.getElementById('sidebarVolumeBtn');
  }

  sidebarRender() {
    const items = document.querySelectorAll('.sidebar__item_link');
    this.uncloseButton.addEventListener('click', () => {
      this.uncloseButton.classList.toggle('sidebarUncloseBtn');
      items.forEach((e) => {
        e.classList.toggle('active');
      });
    });
  }

  settingButtonRender() {
    this.settingButton.addEventListener('click', () => {
      console.log('Ok');
    });
  }

  volumeButtonRender() {
    this.volumeButton.addEventListener('click', () => {
      console.log('Ok');
    });
  }
}

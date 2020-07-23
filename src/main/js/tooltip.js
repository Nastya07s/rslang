export default {
  init() {
    this.tooltipLayer = document.querySelector('.tooltip');
    this.closeTooltipBtn = document.querySelector('.tooltip_btn');
    if (!window.localStorage.getItem('tooltip')) {
      this.tooltipLayer.style.display = 'flex';
    }
    this.setTooltip();
    this.setListeners();
  },
  setListeners() {
    this.closeTooltipBtn.addEventListener('click', () => {
      window.localStorage.setItem('tooltip', true);
      this.tooltipLayer.classList.add('fade-out');
      setTimeout(() => {
        this.tooltipLayer.style.display = 'none';
        this.tooltipLayer.classList.remove('fade-out');
      }, 500);
    });
  },

  setTooltip() {
    if (!window.localStorage.getItem('tooltip')) {
      this.tooltipLayer.style.display = 'flex';
    }
  },

};

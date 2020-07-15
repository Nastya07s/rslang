
export default {
  init() {
    this.tooltipLayer = document.querySelector('.tooltip');
    this.showTooltipBtn = document.querySelector('.show-tooltip_btn');
    this.closeTooltipBtn = document.querySelector('.tooltip_btn');
    this.setListeners();
  },
  setListeners() {
    this.closeTooltipBtn.addEventListener('click', () => {
      this.tooltipLayer.classList.add('fade-out');
      setTimeout(() => {
        this.tooltipLayer.style.display = 'none';
        this.tooltipLayer.classList.remove('fade-out');
      }, 500);
    });
    this.showTooltipBtn.addEventListener('click', () => {
      this.tooltipLayer.style.display = 'flex';
      this.tooltipLayer.classList.add('fade-in');
      setTimeout(() => {
        this.tooltipLayer.classList.remove('fade-in');
      }, 500);
    });
  },
};

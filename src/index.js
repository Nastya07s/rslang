import './js/main';
import './scss/main.scss';

const sidebar = document.getElementById('sidebar');
const items = document.querySelectorAll('.sidebar__item_link');

sidebar.addEventListener('mouseenter', () => {
  items.forEach(e => {
    e.classList.add('active');
  });
});

sidebar.addEventListener('mouseleave', () => {
  items.forEach(e => {
    e.classList.remove('active');
  });
});

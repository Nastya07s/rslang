const app = (function () {
  let body;
  let menu;
  let menuItems;
  const init = function init() {
    body = document.querySelector('body');
    menu = document.querySelector('.menu-icon');
    menuItems = document.querySelectorAll('.nav__list-item');
    applyListeners();
  };
  var applyListeners = function applyListeners() {
    menu.addEventListener('click', () => toggleClass(body, 'nav-active'));
  };
  var toggleClass = function toggleClass(element, stringClass) {
    if (element.classList.contains(stringClass)) element.classList.remove(stringClass); else element.classList.add(stringClass);
  };
  init();
}());

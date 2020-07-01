import Api from './api';

const api = new Api();

api.checkLogin().then((user) => {
  // Already logged in
  console.log(user);
}, () => {
  // Redirect to login
});

const topOffset = document.querySelector('.header').offsetHeight;
const anchors = document.querySelectorAll('.hover-target');

function onScroll() {
  const currentPosition = window.scrollY;
  const sections = document.querySelectorAll('section');
  const lastLink = document.querySelector('.last-link');

  sections.forEach((el) => {
    if ((el.offsetTop - topOffset) <= currentPosition
    && (el.offsetTop + el.offsetHeight - topOffset) > currentPosition) {
      anchors.forEach((a) => {
        a.parentElement.classList.remove('active-nav');
        if (el.getAttribute('id') === a.getAttribute('href').substring(1)) {
          a.parentElement.classList.add('active-nav');
        }
        if (currentPosition + 1 >= document.documentElement.scrollHeight
          - document.documentElement.clientHeight) {
          a.parentElement.classList.remove('active-nav');
          lastLink.parentElement.classList.add('active-nav');
        }
      });
    }
  });
}

document.addEventListener('scroll', onScroll);

anchors.forEach((link) => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const href = this.getAttribute('href').substring(1);
    const scrollTarget = document.getElementById(href);
    const elementPosition = scrollTarget.getBoundingClientRect().top;
    const offsetPosition = elementPosition - topOffset;
    window.scrollBy({
      top: offsetPosition,
      behavior: 'smooth',
      block: 'start',
    });
  });
});

const login = document.querySelector('.switcher-login');
const signup = document.querySelector('.switcher-signup');

const switchLink = document.querySelectorAll('.toggler');
const flipForm = document.querySelector('.wrap');

const modalWrap = document.querySelector('.modal-wrapper');
const preStartButton = document.querySelector('.modal_wrap');

preStartButton.addEventListener('click', () => {
  modalWrap.classList.add('show_modal');
  setTimeout(() => {
    modalWrap.classList.remove('show_modal');
  }, 6000);
});

switchLink.forEach((el) => {
  el.addEventListener('click', () => {
    flipForm.classList.toggle('flipped');
  });
});

login.addEventListener('click', () => {
  if (flipForm.classList.contains('flipped')) {
    flipForm.classList.remove('flipped');
  }
});

signup.addEventListener('click', () => {
  if (!flipForm.classList.contains('flipped')) {
    flipForm.classList.add('flipped');
  }
});

const app = () => {
  let body;
  let menu;
  const menuItems = document.querySelectorAll('.nav__list-item');
  const toggleClass = (element, stringClass) => {
    if (element.classList.contains(stringClass)) {
      element.classList.remove(stringClass);
    } else {
      element.classList.add(stringClass);
    }
  };

  menuItems.forEach((link) => {
    link.addEventListener('click', () => {
      body.classList.remove('nav-active');
    });
  });

  const applyListeners = () => {
    menu.addEventListener('click', () => {
      toggleClass(body, 'nav-active');
    });
  };
  const init = () => {
    body = document.querySelector('body');
    menu = document.querySelector('.menu-icon');
    applyListeners();
  };
  init();
};
app();


export default {
  initPromo() {
    this.topOffset = document.querySelector('.header').offsetHeight;
    this.anchors = document.querySelectorAll('.hover-target');

    this.login = document.querySelector('.switcher-login');
    this.signup = document.querySelector('.switcher-signup');

    this.switchLink = document.querySelectorAll('.toggler');
    this.flipForm = document.querySelector('.wrap');

    this.modalWrap = document.querySelector('.modal-wrapper');
    this.preStartButton = document.querySelector('.modal_wrap');

    this.passwordVisibility = document.querySelectorAll('.eye-box');

    this.passwordVisibility.forEach((eye) => {
      eye.addEventListener('click', () => {
        this.togglePassword();
      });
    });

    document.addEventListener('scroll', this.onScroll.bind(this));

    this.preStartButton.addEventListener('click', () => {
      this.modalWrap.classList.add('show_modal');
      setTimeout(() => {
        this.modalWrap.classList.remove('show_modal');
      }, 6000);
    });

    this.switchLink.forEach((el) => {
      el.addEventListener('click', () => {
        this.flipForm.classList.toggle('flipped');
      });
    });

    this.login.addEventListener('click', () => {
      if (this.flipForm.classList.contains('flipped')) {
        this.flipForm.classList.remove('flipped');
      }
    });

    this.signup.addEventListener('click', () => {
      if (!this.flipForm.classList.contains('flipped')) {
        this.flipForm.classList.add('flipped');
      }
    });
    this.anchors.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href').substring(1);
        const scrollTarget = document.getElementById(href);
        const elementPosition = scrollTarget.getBoundingClientRect().top;
        const offsetPosition = elementPosition - this.topOffset;
        window.scrollBy({
          top: offsetPosition,
          behavior: 'smooth',
          block: 'start',
        });
      });
    });
    this.app();
  },


  onScroll() {
    const currentPosition = window.scrollY;
    const sections = document.querySelectorAll('section');
    const lastLink = document.querySelector('.last-link');

    sections.forEach((el) => {
      if ((el.offsetTop - this.topOffset) <= currentPosition
    && (el.offsetTop + el.offsetHeight - this.topOffset) > currentPosition) {
        this.anchors.forEach((a) => {
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
  },

  app() {
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
  },

  togglePassword() {
    const password = document.querySelectorAll('.password');
    password.forEach((el) => {
      const pass = el;
      if (pass.type === 'password') {
        pass.type = 'text';
      } else {
        pass.type = 'password';
      }
    });
  },

};

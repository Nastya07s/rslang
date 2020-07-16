import 'app/scss/main.scss';
import employeeData from './employeeData';

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

    this.employeeContainer = document.querySelector('.employee-container');
    this.employeeModal = document.querySelector('.employee__modal-window');
    this.modalCloseBtn = document.querySelector('.btn-close_modal');

    this.employeeContainer.addEventListener('click', (e) => {
      let { target } = e;
      const EMPLOYEE_CLASSNAME = 'employee';
      const isCorrectTarget = target.classList.contains(EMPLOYEE_CLASSNAME);

      if (!isCorrectTarget) {
        const parentElement = target.closest(`.${EMPLOYEE_CLASSNAME}`);

        if (!parentElement) {
          return;
        }

        target = parentElement;
      }

      const id = target.getAttribute('data-id');

      if (id) {
        const nameBox = this.employeeModal.querySelector('.employee__name');
        const positionBox = this.employeeModal.querySelector('.employee__title');
        const emailBox = this.employeeModal.querySelector('.employee__contact');
        const descriptionBox = this.employeeModal.querySelector('.employee__stuff');

        nameBox.textContent = employeeData[id].name;
        positionBox.textContent = employeeData[id].position;
        emailBox.textContent = employeeData[id].email;
        emailBox.setAttribute('href', `mailto:${employeeData[id].email}`);

        descriptionBox.textContent = '';

        employeeData[id].list.forEach((el) => {
          const li = document.createElement('li');

          li.textContent = el;
          descriptionBox.appendChild(li);
        });
        this.employeeModal.classList.remove('employee__modal-window_hidden');
        this.employeeModal.classList.remove('scale-out-center');
      }
    });

    this.modalCloseBtn.addEventListener('click', () => {
      this.employeeModal.classList.add('scale-out-center');
      setTimeout(() => {
        this.employeeModal.classList.add('employee__modal-window_hidden');
      }, 500);
    });

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
        this.modalWrap.classList.add('scale-out-center');
      }, 4000);
      setTimeout(() => {
        this.modalWrap.classList.remove('show_modal');
        this.modalWrap.classList.remove('scale-out-center');
      }, 4500);
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

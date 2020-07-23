import Login from 'app/js/login';
import api from './api';

export default class Registration {
  constructor() {
    this.inputEmail = document.querySelector('#signup-email');
    this.inputPassword = document.querySelector('#signup-password');
    this.formRegistration = document.querySelector('.form-registration');
    this.formLogin = document.querySelector('.form-registration');
    this.showWarnings = document.querySelector('.login-errors');
    this.formLogin.addEventListener('submit', this.onSubmit.bind(this));
  }

  onSubmit(event) {
    event.preventDefault();
    const email = this.inputEmail.value;
    const password = this.inputPassword.value;
    if (!email) {
      this.showErrors('Введите почту');
    }
    if (!password) {
      this.showErrors('Введите пароль');
    }
    const isValidPassword = /[A-ZА-Я]/.test(password) && /[a-zа-я]/.test(password)
      && /\d/.test(password) && /[+\-_@$!%*?&#.,;:[\]{}]/.test(password);
    if (!isValidPassword) {
      const errText = 'Пароль должен содержать не менее 8 символов, '
        + 'как минимум одну прописную букву, одну заглавную букву, одну цифру и один '
        + 'спецсимвол из +-_@$!%*?&#.,;:[]{}';
      this.showErrors(errText);
    }
    if (!email || !password || !isValidPassword) {
      return false;
    }
    this.registrationRequest({ email, password });
    return false;
  }

  registrationRequest(user) {
    api.createUser(user)
      .then(() => {
        this.loginService = new Login();
        this.loginService.loginRequest(user);
      }, (response) => {
        if (response === 'user with this e-mail exists') {
          this.showErrors('Пользователь уже существует');
        } else {
          this.showErrors('Ошибка регистрации');
        }
      });
  }

  showErrors(text) {
    this.showWarnings.textContent = text;
    this.showWarnings.classList.add('show_modal');
    this.showWarnings.style.display = 'flex';
    setTimeout(() => {
      this.showWarnings.style.display = 'none';
      this.showWarnings.textContent = '';
    }, 4500);
  }
}

import settings from 'app/js/settings';
import Statistics from 'app/js/statistics';
import api from './api';

export default class Login {
  constructor() {
    this.inputEmail = document.querySelector('#login-email');
    this.inputPassword = document.querySelector('#login-password');
    this.formLogin = document.querySelector('.form-login');
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
    if (!email || !password) {
      return false;
    }
    this.loginRequest({ email, password });
    return false;
  }

  loginRequest(user) {
    api.loginUser(user)
      .then(async () => {
        this.statisticsService = new Statistics();
        this.settings = settings;
        await this.settings.getSettings();
        window.location.href = '/main';
      }, () => {
        this.showErrors('Неверная почта или пароль');
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

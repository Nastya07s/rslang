import Settings from './settings';
import Statistics from './statistics';
import api from './api';

export default class Login {
  constructor() {
    this.inputEmail = document.querySelector('#login-email');
    this.inputPassword = document.querySelector('#login-password');
    this.formLogin = document.querySelector('.form-login');
    this.formLogin.addEventListener('submit', this.onSubmit.bind(this));
  }

  onSubmit(event) {
    event.preventDefault();
    const email = this.inputEmail.value;
    const password = this.inputPassword.value;
    if (!email) {
      this.showEmailErrors('Введите почту');
    } else {
      this.showEmailErrors('');
    }
    if (!password) {
      this.showPassErrors('Введите пароль');
    } else {
      this.showPassErrors('');
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
        this.settings = new Settings();
        await this.settings.getSettings();
        window.location.href = '/';
      }, () => {
        this.showPassErrors('Неверная почта или пароль');
      });
  }

  showPassErrors(text) {
    this.inputPassword.setCustomValidity(text);
  }

  showEmailErrors(text) {
    this.inputEmail.setCustomValidity(text);
  }
}

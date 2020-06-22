import Api from './api';

export default class Login {
  constructor() {
    this.api = new Api();
    this.inputEmail = document.querySelector('.input-email');
    this.errorEmail = document.querySelector('.form-login__email-error');
    this.inputPassword = document.querySelector('.input-password');
    this.errorPassword = document.querySelector('.form-login__password-error');
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
      this.errorEmail.innerHTML = '';
    }
    if (!password) {
      this.showPassErrors('Введите пароль');
    } else {
      this.errorPassword.innerHTML = '';
    }
    if (!email || !password) {
      return false;
    }
    this.loginRequest({ email, password });
    return false;
  }

  loginRequest(user) {
    this.api.loginUser(user)
      .then(() => {
        window.location.href = './app.html';
      }, () => {
        this.showPassErrors('Неверная почта или пароль');
      });
  }

  showPassErrors(text) {
    this.errorPassword.innerHTML = text;
    this.errorPassword.style.display = 'block';
    setTimeout(() => {
      this.errorPassword.style.display = 'none';
    }, 4000);
  }

  showEmailErrors(text) {
    this.errorEmail.innerHTML = text;
    this.errorEmail.style.display = 'block';
    setTimeout(() => {
      this.errorEmail.style.display = 'none';
    }, 4000);
  }
}

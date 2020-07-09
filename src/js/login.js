import Statistics from 'app/js/statistics';
import api from './api';

export default class Login {
  constructor(selector) {
    this.container = document.querySelector(selector);
    this.createForm();
  }

  createForm() {
    this.container.innerHTML = `
        <form class="form-login">
          <header>Войти</header>
          <div class="form-login__input">
            <input class="input-email" type="email" placeholder="Почта" required autocomplete="off"/>
            <div class="form-login__email-error"></div>
          </div>
          <div class="form-login__input">
            <input class="input-password" type="password" placeholder="Пароль" required autocomplete="off"/>
            <div class="form-login__password-error"></div>
          </div>
          <p class="form-login__signup"><a href="#">Создать аккаунт</a></p>
          <button type="submit" class="button button-block form-login_button-login"/>Войти</button>
        </form>`;
    this.inputEmail = this.container.querySelector('.input-email');
    this.errorEmail = this.container.querySelector('.form-login__email-error');
    this.inputPassword = this.container.querySelector('.input-password');
    this.errorPassword = this.container.querySelector('.form-login__password-error');
    this.formLogin = this.container.querySelector('.form-login');
    this.formLogin.addEventListener('submit', this.onSubmit.bind(this));
  }

  onSubmit(event) {
    event.preventDefault();
    const email = this.inputEmail.value;
    const password = this.inputPassword.value;
    if (!email) {
      this.errorEmail.innerHTML = 'Введите почту';
    } else {
      this.errorEmail.innerHTML = '';
    }
    if (!password) {
      this.errorPassword.innerHTML = 'Введите пароль';
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
    api.loginUser(user)
      .then(() => {
        window.location.href = '/';
        this.statisticsSevice = new Statistics();
      }, () => {
        this.errorPassword.innerHTML = 'Неверная почта или пароль';
      });
  }
}

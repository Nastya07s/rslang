import api from './api';

export default class Registration {
  constructor(selector) {
    this.container = document.querySelector(selector);
    this.createForm();
  }

  createForm() {
    this.container.innerHTML = `
        <form action="/" method="post" class="form-registration">
          <header>Регистрация</header>
          <div class="form-registration_input">
            <input class="input-email" type="email" placeholder="Почта" required autocomplete="off"/>
            <div class="form-registration__email-error"></div>
          </div>
          <div class="form-registration_input">
            <input class="input-password" type="password" placeholder="Пароль" required autocomplete="off"/>
             <div class="form-registration__password-error"></div>
          </div>
          <p class="form-registration_signup"><a href="#">У меня уже есть аккаунт</a></p>
          <button type="submit" class="button button-block form-registration_button-login"/>Создать аккаунт</button>
        </form>`;
    this.inputEmail = this.container.querySelector('.input-email');
    this.inputPassword = this.container.querySelector('.input-password');
    this.formRegistration = this.container.querySelector('.form-registration');
    this.errorEmail = this.container.querySelector('.form-registration__email-error');
    this.errorPassword = this.container.querySelector('.form-registration__password-error');
    this.formLogin = this.container.querySelector('.form-registration');
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
    const isValidPassword = /[A-ZА-Я]/.test(password) && /[a-zа-я]/.test(password)
      && /\d/.test(password) && /[+\-_@$!%*?&#.,;:[\]{}]/.test(password);
    if (!isValidPassword) {
      this.errorPassword.innerHTML = 'Пароль должен содержать не менее 8 символов, '
        + 'как минимум одну прописную букву, одну заглавную букву, одну цифру и один '
        + 'спецсимвол из +-_@$!%*?&#.,;:[]{}';
    } else {
      this.errorPassword.innerHTML = '';
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
        // Заменить url, когда создадим основную страницу приложения
        window.location.href = './app.html';
      }, (response) => {
        if (response === 'user with this e-mail exists') {
          this.errorPassword.innerHTML = 'Пользователь уже существует';
        } else {
          this.errorPassword.innerHTML = 'Ошибка регистрации';
        }
      });
  }
}

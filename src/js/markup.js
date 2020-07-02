const markup = {
  mainPage: `
  <section class="block center">
    <div class="block-wrapper">
      <div class="block__slider slider-block">
        <div class="swiper-container swiper-no-swiping">
          <div class="swiper-wrapper">
          </div>
        </div>
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
      </div>
      <div class="block__lvl lvl-block flex">
        <div class="lvl-block__item"><span>Снова</span></div>
        <div class="lvl-block__item"><span>Легко</span></div>
        <div class="lvl-block__item"><span>Хорошо</span></div>
        <div class="lvl-block__item"><span>Трудно</span></div>
      </div>
      <div class="block__bar bar-block flex">
        <div class="bar-block__numone"></div>
        <div class="bar-block__line">
          <div class="bar-block__linebar"></div>
        </div>
        <div class="bar-block__numtwo"></div>
      </div>
    </div>
  </section> `,
  settingsPage: `
  <section class="settings center">
    <div class="card settings__card">
      <div class="settings__set">
        Настройки
      </div>
      <div class="settings__other">
        <div class="settings__item flex">
          <div class="settings__text">Режим изучения слов</div>
          <select class="settings__mode">
            <option value="random">Вперемешку</option>
            <option value="onlyNew">Только новые слова</option>
            <option value="onlyLerning">Только изучаемые слова</option>
          </select>
        </div>
        <div class="settings__item flex">
          <div class="settings__text">Количество новых слов</div>
          <input type="text" class="settings__square-big">
        </div>
        <div class="settings__item flex">
          <div class="settings__text">Количество карточке в день</div>
          <input type="text" class="settings__square-big">
        </div>
        <div class="settings__item flex">
          <div class="settings__text">Предложение с объяснением</div>
          <label >
              <input type="checkbox" class="custom-checkbox" name="happy" value="yes" />
              <span></span>
            </label>
        </div>
        <div class="settings__item flex">
          <div class="settings__text">Пример использования</div>
          <label >
            <input type="checkbox" class="custom-checkbox" name="happy" value="yes" />
            <span></span>
          </label>
        </div>
        <div class="settings__item flex">
          <div class="settings__text">Перевод слова</div>
          <label >
            <input type="checkbox" class="custom-checkbox" name="happy" value="yes" />
            <span></span>
          </label>
        </div>
        <div class="settings__item flex">
          <div class="settings__text">Картинка-ассоциация</div>
          <label >
            <input type="checkbox" class="custom-checkbox" name="happy" value="yes" />
            <span></span>
          </label>
        </div>
        <div class="settings__item flex">
          <div class="settings__text">Транскрипция</div>
          <label >
            <input type="checkbox" class="custom-checkbox" name="happy" value="yes" />
            <span></span>
          </label>
        </div>
        <div class="settings__item flex">
          <div class="settings__text">Кнопка показать ответ</div>
          <label >
            <input type="checkbox" class="custom-checkbox" name="happy" value="yes" />
            <span></span>
          </label>
        </div>
        <div class="settings__item flex">
          <div class="settings__text">Кнопка удалить</div>
          <label >
            <input type="checkbox" class="custom-checkbox" name="happy" value="yes" />
            <span></span>
          </label>
        </div>
        <div class="settings__item flex">
          <div class="settings__text">Кнопка добавить в сложные слова</div>
          <label >
            <input type="checkbox" class="custom-checkbox" name="happy" value="yes" />
            <span></span>
          </label>
        </div>
      </div>
      <div class="settings__logout"><a>Выйти из аккаунта</a></div>
    </div>
  </section> 
  `,
  vocabularyPage: `
  <section class="vocabulary card">
    <div class="vocabulary__title flex">
      <div class="vocabulary__about">Словарь</div>
    </div>
    <div class="vocabulary__info flex">
      <div class="vocabulary__info-title vocabulary__info-title-active"><a>Изучаемые&nbsp;слова</a></div>
      <div class="vocabulary__info-title"><a>Сложные</a></div>
      <div class="vocabulary__info-title"><a>Удалённые</a></div>
    </div>
    <div class="vocabulary__num">Всeго слов: 330</div>
    <div class="vocabulary__template template-vocabulary">
    </div>
  </section>
  `,
  statisticsPage: `
  <section class="statistics card">
    <div class="statistics__title">Статистика</div>
    <div class="statistics__graph">
      <div class="statistics__text">Место для графика</div>
    </div>
  </section>
  `,
};

export default markup;

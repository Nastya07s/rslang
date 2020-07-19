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
      <div class="block__lvl lvl-block flex opacity-0">
        <div class="lvl-block__item" data-degreeOfKnowledge="0"><span>Снова</span></div>
        <div class="lvl-block__item" data-degreeOfKnowledge="1"><span>Трудно</span></div>
        <div class="lvl-block__item" data-degreeOfKnowledge="2"><span>Хорошо</span></div>
        <div class="lvl-block__item" data-degreeOfKnowledge="4"><span>Легко</span></div>
      </div>
      <div class="block__bar bar-block flex">
        <div class="bar-block__numone"></div>
        <div class="bar-block__line">
          <div class="bar-block__linebar"></div>
        </div>
        <div class="bar-block__numtwo"></div>
      </div>
    </div>
  </section> 
  <div class="modal card d-none">
    <p>Дневная норма выполнена</p>
    <div class="flex">
      <p>Карточек завершено:</p>
      <p class="cardsCompleted">8</p>
    </div>
    <div class="flex">
      <p>Правильные ответы:</p>
      <p class="correctAnswers">25%</p>
    </div>
    <div class="flex">
      <p>Новые слова:</p>
      <p class="numberOfNewWords">4</p>
    </div>
    <div class="flex">
      <p>Самая длинная серия правильных ответов:</p>
      <p class="longestSeriesOfCorrectAnswers">2</p>
    </div>
  </div>`,
  settingsPage: `
  <section class="settings center">
    <div class="card settings__card">
      <div class="settings__set">
        Настройки
      </div>
      <div class="settings__other">
        <div class="settings__item flex">
          <div class="settings__text">Режим изучения слов</div>
          <select class="settings__mode" data-settings="learningMode">
            <option value="mix">Вперемешку</option>
            <option value="new">Только новые слова</option>
            <option value="learning">Только изучаемые слова</option>
            <option value="old">Только изученные слова</option>
          </select>
        </div>
        <div class="settings__item flex">
          <div class="settings__text">Количество новых слов</div>
          <input type="number" class="settings__square-big" data-settings=countNewWords min="0" max="50">
        </div>
        <div class="settings__item flex">
          <div class="settings__text">Количество карточек в день</div>
          <input type="number" class="settings__square-big" data-settings=wordsPerDay min="1" max="50">
        </div>
        <div class="settings__item flex">
          <div class="settings__text">Предложение с объяснением</div>
          <label >
              <input type="checkbox" class="custom-checkbox" name="happy" value="yes" data-settings="definitionSentence"/>
              <span></span>
            </label>
        </div>
        <div class="settings__item flex">
          <div class="settings__text">Пример использования</div>
          <label >
            <input type="checkbox" class="custom-checkbox" name="happy" value="yes" data-settings="exampleSentence"/>
            <span></span>
          </label>
        </div>
        <div class="settings__item flex">
          <div class="settings__text">Перевод слова</div>
          <label >
            <input type="checkbox" class="custom-checkbox" name="happy" value="yes" data-settings="translateWord"/>
            <span></span>
          </label>
        </div>
        <div class="settings__item flex">
          <div class="settings__text">Картинка-ассоциация</div>
          <label >
            <input type="checkbox" class="custom-checkbox" name="happy" value="yes" data-settings="associationImage"/>
            <span></span>
          </label>
        </div>
        <div class="settings__item flex">
          <div class="settings__text">Транскрипция</div>
          <label >
            <input type="checkbox" class="custom-checkbox" name="happy" value="yes" data-settings="transcription"/>
            <span></span>
          </label>
        </div>
        <div class="settings__item flex">
          <div class="settings__text">Кнопка показать ответ</div>
          <label >
            <input type="checkbox" class="custom-checkbox" name="happy" value="yes" data-settings="answerButton"/>
            <span></span>
          </label>
        </div>
        <div class="settings__item flex">
          <div class="settings__text">Кнопка удалить</div>
          <label >
            <input type="checkbox" class="custom-checkbox" name="happy" value="yes" data-settings="deleteButton"/>
            <span></span>
          </label>
        </div>
        <div class="settings__item flex">
          <div class="settings__text">Кнопка добавить в сложные слова</div>
          <label >
            <input type="checkbox" class="custom-checkbox" name="happy" value="yes" data-settings="hardWordsButton"/>
            <span></span>
          </label>
        </div>
      </div>
      <div class="settings__logout show-tooltip_btn"><a>Пройти обучение заново</a></a></div>
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
      <div class="vocabulary__info-title vocabulary__info-title-active" data-word="all">Все</div>
      <div class="vocabulary__info-title" data-word="learning">На изучении</div>
      <div class="vocabulary__info-title" data-word="hard">Сложные</div>
      <div class="vocabulary__info-title" data-word="delete">Удалённые</div>
      <div class="vocabulary__info-title" data-word="old">Изученные</div>
    </div>
    <div class="vocabulary__num">Всeго слов: <span></span></div>
    <div class="vocabulary__template template-vocabulary">
    </div>
  </section>
  `,
  statisticsPage: `
  <section class="statistics card">
    <div class="statistics__title">Статистика</div>
    <div class="statistics__graph">
    </div>
  </section>
  `,
  loader: `
  <div class="backdrop">
    <div class="loader-data">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
    </div>
  </div>`,
};

export default markup;

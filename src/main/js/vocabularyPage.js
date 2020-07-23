import performRequests from 'app/js/utils/perform-requests';
import markup from './markup';
import store from './store';
import api from '../../js/api';
import settings from '../../js/settings';
import { nextRepetition } from '../../js/intervalRepeatMethod';

function shuffleArray(array) {
  return array.sort(() => 0.5 - Math.random());
}

class VocabularyPage {
  constructor() {
    this.parent = document.querySelector('.wrapper');
  }

  async init() {
    store.isRendered = false;
    this.parent.innerHTML = markup.loader;
    const params = {
      wordsPerPage: 3600,
      filter: { $nor: [{ userWord: null }] },
    };
    const data = await performRequests([api.getUsersAggregatedWords.bind(api, params)]);
    const [responseResults] = data;
    const [results] = responseResults;
    const { paginatedResults: words } = results;
    this.words = shuffleArray(words);
    this.render();
    this.initHandlers();
  }

  render() {
    this.parent.innerHTML = markup.vocabularyPage;
    const vocabularyCountainer = document.querySelector('.vocabulary__template');
    this.words.forEach((word) => {
      const { _id: id } = word;
      let count = +word.userWord.optional.degreeOfKnowledge;
      const { lastRepetition, isDelete, isHard } = word.userWord.optional;
      const nextRepetitionTimeStamp = nextRepetition(count, lastRepetition);
      const nextRepetitionDate = typeof nextRepetitionTimeStamp === 'number'
        ? new Date(nextRepetitionTimeStamp).toLocaleDateString()
        : nextRepetitionTimeStamp;
      const wordElement = document.createElement('div');
      wordElement.classList.add('template-vocabulary__body', 'flex');
      wordElement.dataset.id = id;
      wordElement.dataset.hard = isHard;
      wordElement.dataset.delete = isDelete;
      wordElement.dataset.learning = count < 5 ? 'true' : 'false';
      wordElement.dataset.old = count === 5 ? 'true' : 'false';
      wordElement.dataset.all = 'true';
      wordElement.innerHTML = `
      <div class="template-vocabulary__title flex">
        <div class="template-vocabulary__lvl">
          <div class="complexity flex">
            <span class="complexity__circle"></span>
            <span class="complexity__circle"></span>
            <span class="complexity__circle"></span>
            <span class="complexity__circle"></span>
            <span class="complexity__circle"></span>
          </div>
        </div>
        <div class="template-vocabulary__restore d-none"><a href="">Восстановить</a></div>
      </div>
      <div class="template-vocabulary__all flex">
        <div class="template-vocabulary__info">
          <div class="template-vocabulary__word flex">
            <span>${word.word}</span>
            <span class="d-none" data-settings="transcription"> - ${word.transcription}</span>
            <span class="d-none" data-settings="translateWord"> - ${word.wordTranslate}</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="d-none" data-settings="isGlobalMute">
              <path
                d="M11.6227 0.732372C11.3907 0.621705 11.1173 0.651038 10.9173 0.812372L4.432 6.00037H1.33333C0.598667 6.00037 0 6.59904 0 7.3337V12.667C0 13.403 0.598667 14.0004 1.33333 14.0004H4.432L10.916 19.1884C11.0373 19.2844 11.1853 19.3337 11.3333 19.3337C11.432 19.3337 11.5307 19.311 11.6227 19.267C11.8533 19.1564 12 18.923 12 18.667V1.3337C12 1.0777 11.8533 0.844372 11.6227 0.732372Z"
                stroke="black"
                stroke-opacity="0.56"
              />
              <path
                d="M15.3746 5.28569C15.112 5.02702 14.6906 5.03102 14.432 5.29102C14.1733 5.55369 14.176 5.97502 14.4373 6.23502C15.4453 7.22969 16 8.56702 16 10.0004C16 11.4337 15.4453 12.771 14.4373 13.7657C14.176 14.023 14.1733 14.4457 14.432 14.7084C14.5626 14.8404 14.7346 14.9057 14.9053 14.9057C15.0746 14.9057 15.244 14.8417 15.3746 14.7124C16.6386 13.4684 17.3333 11.7937 17.3333 10.0004C17.3333 8.20702 16.6386 6.53236 15.3746 5.28569Z"
                stroke="black"
                stroke-opacity="0.56"
              />
              <path
                d="M17.256 3.40704C16.9933 3.14704 16.572 3.14971 16.312 3.41104C16.0533 3.67237 16.056 4.09504 16.316 4.35371C17.832 5.85637 18.6667 7.86171 18.6667 10.0004C18.6667 12.139 17.832 14.143 16.316 15.6457C16.056 15.9057 16.0533 16.3284 16.312 16.5897C16.444 16.7204 16.6147 16.7857 16.7853 16.7857C16.9547 16.7857 17.1253 16.7217 17.256 16.5924C19.0267 14.839 20 12.4977 20 10.0004C20 7.50304 19.0267 5.16171 17.256 3.40704Z"
                stroke="black"
                stroke-opacity="0.56"
              />
            </svg>
            <audio src="https://raw.githubusercontent.com/kamikozz/rslang-data/master/${word.audio}"></audio>
          </div>
          <div class="template-vocabulary__example d-none" data-settings="exampleSentence">
            <span>Пример:</span>
            <span>The students <b>agree</b> they have too much homework.</span>
          </div>
          <div class="template-vocabulary__value d-none" data-settings="definitionSentence">
            <span>Значение:</span>
            <span>To <i>agree</i> is to have the same opinion or belief as another person.</span>
          </div>
          <div class="template-vocabulary__time flex">
            <div class="template-vocabulary__lasttime">Последние повторение: <span>${new Date(
    +word.userWord.optional.lastRepetition,
  ).toLocaleDateString()}</span></div>
            <div class="template-vocabulary__nexttime">Следующее повторение: <span>${nextRepetitionDate}</span></div>
            <div class="template-vocabulary__num">Повторения: <span>${+word.userWord.optional
    .countRepetition}</span></div>
          </div>
        </div>
        <div class="template-vocabulary__image d-none" data-settings="associationImage"><img src="https://raw.githubusercontent.com/kamikozz/rslang-data/master/${
  word.image
}" alt="" /></div>
      </div>`;
      wordElement.querySelectorAll('.complexity__circle').forEach((el) => {
        if (count) {
          el.classList.add('complexity__circle-active');
          count -= 1;
        }
      });
      wordElement.querySelectorAll('[data-settings]').forEach((el) => {
        if (settings[el.dataset.settings]) el.classList.remove('d-none');
      });
      vocabularyCountainer.append(wordElement);
    });
    this.parent.querySelector('.vocabulary__num span').textContent = this.words.length;
  }

  determineCountVisibleWords() {
    const countVisibleWords = this.parent.querySelectorAll('.template-vocabulary__body:not(.d-none)').length;
    if (countVisibleWords === 0) {
      this.parent.querySelector('.template-vocabulary__body').classList.remove('d-none');
      this.parent.querySelector('.vocabulary__template').classList.add('opacity-0');
    }
    this.parent.querySelector('.vocabulary__num span').textContent = countVisibleWords;
  }

  initHandlers() {
    this.parent.querySelector('.vocabulary__info').addEventListener('click', ({ target }) => {
      this.parent.querySelectorAll('.vocabulary__info-title').forEach((el) => {
        el.classList.remove('vocabulary__info-title-active');
      });

      target.closest('.vocabulary__info-title').classList.add('vocabulary__info-title-active');
    });

    this.parent.querySelector('.vocabulary__info').addEventListener('click', ({ target }) => {
      this.parent.querySelector('.vocabulary__template').classList.remove('opacity-0');
      this.parent.querySelectorAll('.template-vocabulary__body').forEach((el) => {
        el.classList.remove('d-none');
        if (el.dataset[target.dataset.word] !== 'true') el.classList.add('d-none');
        if (target.dataset.word === 'hard' || target.dataset.word === 'delete') {
          el.querySelectorAll('.template-vocabulary__restore').forEach((word) => {
            word.classList.remove('d-none');
            word.addEventListener('click', async (event) => {
              event.preventDefault();
              const idWord = el.dataset.id;
              const [wordObject] = await api.getUsersAggregatedWordsById(idWord);
              const {
                countRepetition,
                degreeOfKnowledge,
                isDelete,
                isHard,
                isReadyToRepeat,
                lastRepetition,
                becameLearned,
              } = wordObject.userWord.optional;
              const deleteResult = el.dataset.delete === 'true' ? !isDelete : isDelete;
              const hardResult = el.dataset.hard === 'true' ? !isHard : isHard;

              api.updateUserWordById(idWord, {
                difficulty: String(wordObject.group),
                optional: {
                  countRepetition,
                  isDelete: deleteResult,
                  isHard: hardResult,
                  isReadyToRepeat,
                  lastRepetition,
                  degreeOfKnowledge,
                  becameLearned,
                },
              });
              el.classList.add('d-none');
              el.setAttribute('data-hard', hardResult);
              el.setAttribute('data-delete', deleteResult);

              this.determineCountVisibleWords();
            });
          });
        } else el.querySelectorAll('.template-vocabulary__restore').forEach((word) => word.classList.add('d-none'));
      });
      this.determineCountVisibleWords();
    });

    this.parent.querySelectorAll('[data-settings="isGlobalMute"]:not(.d-none)').forEach((el) => {
      el.addEventListener('click', () => {
        if (settings.isGlobalMute) el.nextElementSibling.play();
      });
    });
  }
}

const vocabularyPage = new VocabularyPage();

export default vocabularyPage;

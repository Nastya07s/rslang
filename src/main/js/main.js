import 'app/index';
import 'app/scss/main.scss';
import { checkReadyForRepetition } from 'app/js/intervalRepeatMethod';
import performRequests from 'app/js/utils/perform-requests';
import api from 'app/js/api';
import './animate';

import mainPage from './mainPage';

const processData = (data) => {
  const [responseResults] = data;
  const [results] = responseResults;
  const { paginatedResults } = results;

  // console.log('paginatedResults;: ', paginatedResults);
  return paginatedResults;
};

api.loginUser({ email: 'test3@mail.ru', password: 'QQQwww123.' }).then(async () => {
  const params = {
    wordsPerPage: 3600,
    filter: {
      $and: [
        {
          $nor: [{ userWord: null }],
        },
        {
          'userWord.optional.degreeOfKnowledge': {
            $lt: 5,
          },
        },
      ],
    },
  };

  const wordsResponse = await performRequests([api.getUsersAggregatedWords.bind(api, params)]);
  const words = processData(wordsResponse);
  const promisesForUpdateWords = [];
  words.forEach((word) => {
    const {
      _id: id,
      userWord: {
        difficulty,
        optional: {
          countRepetition, isDelete, isHard, lastRepetition, degreeOfKnowledge, becameLearned,
        },
      },
    } = word;

    const isReadyToRepeat = checkReadyForRepetition(degreeOfKnowledge, lastRepetition);
    console.log('word: ', word);
    console.log('isReadyToRepeat: ', isReadyToRepeat);

    promisesForUpdateWords.push(
      api.updateUserWordById.bind(api, id, {
        difficulty,
        optional: {
          countRepetition,
          isDelete,
          isHard,
          isReadyToRepeat,
          lastRepetition,
          degreeOfKnowledge,
          becameLearned,
        },
      }),
    );
  });

  await performRequests(promisesForUpdateWords);

  mainPage.init();
});

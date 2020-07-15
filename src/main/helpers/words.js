import api from 'app/js/api';
import performRequests from 'app/js/utils/perform-requests';

const FILTERS = {
  LEARNED: {
    $and: [{
      $nor: [
        { userWord: null },
      ],
    }, {
      'userWord.optional.degreeOfKnowledge': {
        $eq: 5,
      },
    }],
  },
};

class WordsGlobalStatistics {
  /**
   * Get total number of the "LEARNED" words.
   */
  static async getTotalCountLearnedWords() {
    const data = await WordsGlobalStatistics.getWordsData({
      wordsPerPage: 1,
      filter: FILTERS.LEARNED,
    });

    if (!data) {
      return data;
    }

    const { count } = data;

    return count;
  }

  static async getTotalCountWords() {
    const data = await WordsGlobalStatistics.getWordsData({
      wordsPerPage: 1,
    });

    if (!data) {
      return data;
    }

    const { count } = data;

    return count;
  }

  static async getLearnedWords() {
    const data = await WordsGlobalStatistics.getWordsData({
      filter: FILTERS.LEARNED,
    });

    if (!data) {
      return data;
    }

    const { results } = data;

    return results;
  }

  static async getWordsData({
    wordsPerPage,
    filter,
  } = {}) {
    const params = {};
    // wordsPerPage = 0 is not be the right value, due to the Server Internal Error
    if (!wordsPerPage) {
      params.wordsPerPage = await WordsGlobalStatistics.getTotalCountWords();
    }

    if (filter) {
      params.filter = filter;
    }

    let data = await performRequests([api.getUsersAggregatedWords.bind(api, params)]);

    if (data) {
      const processData = () => {
        const [responseResults] = data;
        const [results] = responseResults;
        const { paginatedResults, totalCount: [{ count }] } = results;

        return {
          results: paginatedResults,
          count,
        };
      };

      data = processData();
    }

    return data;
  }
}

export default WordsGlobalStatistics;

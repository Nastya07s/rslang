const USER_TOKEN_KEY = 'userCurrentToken';
const USER_TOKEN_KEY_REFRESH = 'userRefreshToken';
const USER_ID_KEY = 'userCurrentId';
const TIME_TO_REFRESH_TOKEN = 10 * 60 * 1000; // 10 min

class Api {
  constructor() {
    this.basicUrl = 'https://afternoon-falls-25894.herokuapp.com';
    this.userId = localStorage.getItem(USER_ID_KEY);
    this.userToken = localStorage.getItem(USER_TOKEN_KEY);
    this.refreshToken = localStorage.getItem(USER_TOKEN_KEY_REFRESH);
  }

  static request(url, method, data) {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then((response) => {
        if (response.ok) {
          return response.json()
            .then((json) => resolve(json), (error) => reject(error));
        }
        return response.text()
          .then((text) => reject(text), (error) => reject(error));
      }, (response) => {
        reject(response);
      });
    });
  }

  requestWithToken(url, method, data, isRefreshToken) {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${isRefreshToken ? this.refreshToken : this.userToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then((response) => {
        // Check token expiration and refresh if expired
        if (this.userToken && !isRefreshToken) {
          const tokenInfo = JSON.parse(atob(this.userToken.split('.')[1]));
          if (tokenInfo.exp * 1000 - Date.now() < TIME_TO_REFRESH_TOKEN) {
            this.getNewUserTokens();
          }
        }
        if (response.ok) {
          return response.json()
            .then((json) => resolve(json), (error) => reject(error));
        }
        return response.text()
          .then((text) => reject(text), (error) => reject(error));
      }, (response) => {
        reject(response);
      });
    });
  }

  getNewUserTokens() {
    return this.requestWithToken(
      `${this.basicUrl}/users/${this.userId}/tokens`,
      'GET',
      undefined,
      true,
    ).then((response) => {
      this.saveLoginResponse(response);
      return response;
    });
  }


  getWords(group = 0, page = 0) {
    return Api.request(`${this.basicUrl}/words?page=${page}&group=${group}`, 'GET');
  }

  getWordsCount(group = 0, wordsPerExampleSentenceLTE = 0, wordsPerPage = 10) {
    return Api.request(`${this.basicUrl}/words/count?group=${group}&`
      + `wordsPerExampleSentenceLTE=${wordsPerExampleSentenceLTE}&`
      + `wordsPerPage=${wordsPerPage}`, 'GET');
  }

  getWordById(id) {
    return Api.request(`${this.basicUrl}/words/${id}`, 'GET');
  }

  /**
   *
   * @param user ({email, password})
   * @returns {Promise<unknown>}
   */
  createUser(user) {
    return Api.request(`${this.basicUrl}/users`, 'POST', user);
  }

  getUserById(id) {
    return this.requestWithToken(`${this.basicUrl}/users/${id}`, 'GET');
  }

  /**
   *
   * @param id
   * @param user ({email, password})
   * @returns {Promise<unknown>}
   */

  updateUser(id, user) {
    return this.requestWithToken(`${this.basicUrl}/users/${id}`, 'PUT', user);
  }

  deleteUser(id) {
    return this.requestWithToken(`${this.basicUrl}/users/${id}`, 'DELETE');
  }

  /**
   *
   * @param user ({email, password})
   * @returns {Promise<unknown>}
   */

  loginUser(user) {
    return Api.request(`${this.basicUrl}/signin`, 'POST', user)
      .then((response) => {
        this.userId = response.userId;
        localStorage.setItem(USER_ID_KEY, this.userId);
        this.saveLoginResponse(response);
        return response;
      });
  }

  logoutUser() {
    this.userToken = null;
    this.refreshToken = null;
    this.userId = null;
    localStorage.removeItem(USER_TOKEN_KEY);
    localStorage.removeItem(USER_TOKEN_KEY_REFRESH);
    localStorage.removeItem(USER_ID_KEY);
  }

  checkLogin() {
    return this.getUserById(this.userId);
  }

  getUserWords() {
    return this.requestWithToken(`${this.basicUrl}/users/${this.userId}/words`, 'GET');
  }

  /**
   *
   * @param data ({difficulty, optional})
   * @returns {Promise<unknown>}
   */

  createUserWord(wordId, data) {
    return this.requestWithToken(`${this.basicUrl}/users/${this.userId}/words/${wordId}`, 'POST', data);
  }

  getUserWordById(id) {
    return this.requestWithToken(`${this.basicUrl}/users/${this.userId}/words/${id}`, 'GET');
  }

  /**
   *
   * @param id
   * @param data ({difficulty, optional})
   * @returns {Promise<unknown>}
   */

  updateUserWordById(id, data) {
    return this.requestWithToken(`${this.basicUrl}/users/${this.userId}/words/${id}`, 'PUT', data);
  }

  deleteUserWord(id) {
    return this.requestWithToken(`${this.basicUrl}/users/${this.userId}/words/${id}`, 'DELETE');
  }

  /**
   * Gets all user aggregated words.
   * @see /users/{id}/aggregatedWords
  * @param {Object} paramsObject arguments' object, contains: `group`, `wordsPerPage` and `filter`
   * @example
   *    {
   *      group: 0,
   *      wordsPerPage: 20,
   *      filter: {
   *        $and:[{
   *          userWord: null,
   *        }],
   *      },
   *    }
   */
  getUsersAggregatedWords(paramsObject = {}) {
    let params = Object.entries(paramsObject);

    params = params
      .map(([param, value]) => `${param}=${JSON.stringify(value)}`)
      .join('&');

    const endpoint = `${this.basicUrl}/users/${this.userId}/aggregatedWords`;
    const separator = params.length ? '?' : '';
    const url = `${endpoint}${separator}${params}`;

    return this.requestWithToken(url, 'GET');
  }

  getUsersAggregatedWordsById(wordId) {
    return this.requestWithToken(`${this.basicUrl}/users/${this.userId}/aggregatedWords/${wordId}`, 'GET');
  }

  getStatistics() {
    return this.requestWithToken(`${this.basicUrl}/users/${this.userId}/statistics`, 'GET');
  }

  /**
   *
   * @param data ({learnedWords, optional})
   * @returns {Promise<unknown>}
   */

  upsertStatistics(data) {
    return this.requestWithToken(`${this.basicUrl}/users/${this.userId}/statistics`, 'PUT', data);
  }

  getSettings() {
    return this.requestWithToken(`${this.basicUrl}/users/${this.userId}/settings`, 'GET');
  }

  /**
   *
   * @param data ({wordsPerDay, optional})
   * @returns {Promise<unknown>}
   */
  upsertSettings(data) {
    return this.requestWithToken(`${this.basicUrl}/users/${this.userId}/settings`, 'PUT', data);
  }

  saveLoginResponse(response) {
    this.userToken = response.token;
    this.refreshToken = response.refreshToken;
    localStorage.setItem(USER_TOKEN_KEY, this.userToken);
    localStorage.setItem(USER_TOKEN_KEY_REFRESH, this.refreshToken);
  }
}

const api = new Api();
export default api;

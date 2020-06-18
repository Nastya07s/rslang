const USER_TOKEN_KEY = 'userCurrentToken';
const USER_ID_KEY = 'userCurrentId';

export default class Api {
  constructor() {
    this.basicUrl = 'https://afternoon-falls-25894.herokuapp.com';
    this.userId = localStorage.getItem(USER_ID_KEY);
    this.userToken = localStorage.getItem(USER_TOKEN_KEY);
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

  requestWithToken(url, method, data) {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${this.userToken}`,
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


  getWords(group, page) {
    const groupNumber = group || 0;
    const pageNumber = page || 0;

    return Api.request(`${this.basicUrl}/words?page=${pageNumber}&group=${groupNumber}`, 'GET');
  }

  getWordsCount(group, wordsPerExampleSentenceLTE, wordsPerPage) {
    const groupNumber = group || 0;
    const wordsPerExampleSentenceLTENumber = wordsPerExampleSentenceLTE || 0;
    const wordsPerPageNumber = wordsPerPage || 10;
    return Api.request(`${this.basicUrl}/words/count?group=${groupNumber}&`
      + `wordsPerExampleSentenceLTE=${wordsPerExampleSentenceLTENumber}&`
      + `wordsPerPage=${wordsPerPageNumber}`, 'GET');
  }

  getWordById(id) {
    return Api.request(`${this.basicUrl}/words/${id}`, 'GET');
  }

  createUser(email, password) {
    const user = {
      email,
      password,
    };

    return Api.request(`${this.basicUrl}/users`, 'POST', user);
  }

  getUserById(id) {
    return this.requestWithToken(`${this.basicUrl}/users/${id}`, 'GET');
  }

  updateUser(id, email, password) {
    const user = {
      email,
      password,
    };

    return this.requestWithToken(`${this.basicUrl}/users/${id}`, 'PUT', user);
  }

  deleteUser(id) {
    return this.requestWithToken(`${this.basicUrl}/users/${id}`, 'DELETE');
  }

  loginUser(email, password) {
    const user = {
      email,
      password,
    };
    return Api.request(`${this.basicUrl}/signin`, 'POST', user)
      .then((response) => {
        this.userToken = response.token;
        this.userId = response.userId;
        localStorage.setItem(USER_TOKEN_KEY, this.userToken);
        localStorage.setItem(USER_ID_KEY, this.userId);

        return response;
      });
  }

  logoutUser() {
    this.userToken = null;
    this.userId = null;
    localStorage.removeItem(USER_TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
  }

  checkLogin() {
    return this.getUserById(this.userId);
  }

  getUserWords() {
    return this.requestWithToken(`${this.basicUrl}/users/${this.userId}/words`, 'GET');
  }

  createUserWord(difficulty, optional) {
    const data = {
      difficulty,
      optional,
    };
    return this.requestWithToken(`${this.basicUrl}/users/${this.userId}/words`, 'POST', data);
  }

  getUserWordById(id) {
    return this.requestWithToken(`${this.basicUrl}/users/${this.userId}/words/${id}`, 'GET');
  }

  updateUserWordById(id, difficulty, optional) {
    const data = {
      difficulty,
      optional,
    };
    return this.requestWithToken(`${this.basicUrl}/users/${this.userId}/words/${id}`, 'PUT', data);
  }

  deleteUserWord(id) {
    return this.requestWithToken(`${this.basicUrl}/users/${this.userId}/words/${id}`, 'DELETE');
  }

  getStatistics() {
    return this.requestWithToken(`${this.basicUrl}/users/${this.userId}/statistics`, 'GET');
  }

  upsertStatistics(learnedWords, optional) {
    const data = {
      learnedWords,
      optional,
    };
    return this.requestWithToken(`${this.basicUrl}/users/${this.userId}/statistics`, 'PUT', data);
  }

  getSettings() {
    return this.requestWithToken(`${this.basicUrl}/users/${this.userId}/settings`, 'GET');
  }

  upsertSettings(wordsPerDay, optional) {
    const data = {
      wordsPerDay,
      optional,
    };
    return this.requestWithToken(`${this.basicUrl}/users/${this.userId}/settings`, 'PUT', data);
  }
}

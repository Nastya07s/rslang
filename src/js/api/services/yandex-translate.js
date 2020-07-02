import performRequests from 'app/js/utils/perform-requests';
import { yandexTranslateApi } from '../credentials';

// https://translate.yandex.net/api/v1.5/tr.json/translate?key={YOUR_KEY}&text=русский&lang=en-ru
const privateGetTranslation = async (sentence, lang = 'en-ru') => {
  const { baseUrl, apiKey } = yandexTranslateApi;
  const processedSentence = encodeURIComponent(String(sentence).trim());
  const params = `key=${apiKey}&text=${processedSentence}&lang=${lang}`;
  const url = `${baseUrl}?${params}`;
  const response = await fetch(url); // Response object

  const { ok } = response;

  if (!ok) {
    const { status } = response;

    switch (status) {
      default: {
        const text = await response.text();

        throw new Error(text);
      }
    }
  }

  const json = await response.json();

  return json;
};

const getTranslation = async (sentence, lang = 'en-ru') => {
  let response = await performRequests([privateGetTranslation.bind(null, sentence, lang)]);

  if (response) {
    [response] = response; // Promise.all returns array of resolved/rejected promises
    response = response.text; // Store "text" argument from JSON object retrieved from Yandex Server
  }

  return response;
};

export default {
  getTranslation,
};

/**
 * Load image using load event and run callback.
 * @param {String} loadImageUrl source url from where image must be loaded
 * @param {Function} callback what must be done when image is loaded
 * @returns promise which can be awaited
 */
const loadImage = (loadImageUrl, callback = () => {}) => {
  const imgElement = new Image();

  imgElement.src = loadImageUrl;

  const promise = new Promise((resolve) => {
    imgElement.onload = () => {
      callback();
      imgElement.remove();
      resolve();
    };
  });

  return promise;
};

/**
 * Shuffles the given array by Fisher and Yates method
 * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#Fisher_and_Yates'_original_method
 * @param {Array|HTMLCollection} array source array which must be shuffled
 * @returns {Array|HTMLCollection} shuffled array of elements
 */
const shuffleFisherYates = (array) => {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i -= 1) {
    const randomIdx = Math.floor(Math.random() * (i + 1));

    [arr[i], arr[randomIdx]] = [arr[randomIdx], arr[i]]; // swap elements
  }

  return arr;
};

export default {
  loadImage,
  shuffleFisherYates,
};

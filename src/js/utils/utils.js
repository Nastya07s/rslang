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
 * Makes promises from array of elements which have load event.
 * @param {HTMLElements} elements which are usually <img>, <object> and all, which have load event
 * @returns array of promises, which must be awaited in the upper scope
 */
const loadElements = (elements) => {
  const promises = [];

  elements.forEach((el) => {
    const element = el;
    const promise = new Promise((resolve) => {
      element.onload = () => {
        resolve();
      };
    });

    promises.push(promise);
  });

  return promises;
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

/**
 * Finds element from some HTMLElement which contains <object>.
 * @param {HTMLElement} item some HTML element which contains <object>
 * @returns <svg> inside of the <object>
 */
const getSvgElement = (item) => {
  const object = item.firstElementChild; // get element <object>
  const svgDocument = object.contentDocument; // get #document element inside of <object>
  const svgElement = svgDocument.firstElementChild; // get <svg> element

  return svgElement;
};

export default {
  loadImage,
  loadElements,
  shuffleFisherYates,
  getSvgElement,
};

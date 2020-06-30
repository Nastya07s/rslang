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

export default {
  loadImage,
};

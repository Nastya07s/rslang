const toggle = () => {
  const [loader] = document.body.getElementsByClassName('loader');

  loader.classList.toggle('loader_hidden');
};

export default {
  toggle,
};

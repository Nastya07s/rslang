export default function createElementDOM(el, classNames, parent) {
  const element = document.createElement(el);

  if (classNames) {
    element.classList.add(...classNames.split(' '));
  }

  if (parent) {
    parent.append(element);
  }

  return element;
}

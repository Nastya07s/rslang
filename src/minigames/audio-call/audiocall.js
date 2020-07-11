import './scss/main.scss';

const testBtn = document.querySelector('.arrow-next');
console.log(testBtn);

let gameCurrent = document.querySelector('.game__current');
let gameNext = document.querySelector('.game__next');

testBtn.addEventListener('click', () => {
  // [gameCurrent.classList, gameNext.classList] = [gameNext.classList, gameCurrent.classList]
  gameCurrent.classList.add('animation');
  gameNext.classList.add('animation');
});

gameNext.addEventListener('animationend', () => {
  gameCurrent.classList.remove('animation');
  gameNext.classList.remove('animation');
  [gameCurrent.classList, gameNext.classList] = [gameNext.className, gameCurrent.className];
  // const tempCurrent = gameCurrent.className;
  // const tempNext = gameNext.className;
  // [gameCurrent, gameNext] = [gameNext, gameCurrent];

  // [a, b] = [b, a];
  gameCurrent = document.querySelector('.game__current');
  gameNext = document.querySelector('.game__next');
  // testBtn = document.querySelector('.game__current .arrow-next');
  // console.log(a, b);

  console.log(gameCurrent, gameNext);
});

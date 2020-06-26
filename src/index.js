/* eslint-disable linebreak-style */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './js/main';
import './scss/main.scss';
import Login from './js/login';
import Registration from './js/registration';
import RenderMainPage from './js/RenderMainPage/RenderMainPage';

const render = new RenderMainPage();
render.init();

const arrow = document.querySelector('.openArrow');
const menu = document.querySelector('.menu');
const GoNon = document.querySelectorAll('.nav-menu__about');
const GoNon2 = document.querySelectorAll('.opportunities-menu__about');
const tеxtlogo = document.querySelector('.menu__tеxtlogo');
const itemOn = document.querySelector('.opportunities-menu__item-on');
const itemOff = document.querySelector('.opportunities-menu__item-off');
const slides = document.querySelectorAll('.card');
const numSlides = document.querySelector('.bar-block__numtwo');
const lineBar = document.querySelector('.bar-block__linebar');
const prev = document.querySelector('.swiper-button-prev');
const next = document.querySelector('.swiper-button-next');
const accordionShow = document.querySelectorAll('.slider-b-body__accordionshow');
const goShow = document.querySelectorAll('.slider-b-body__goshow');
const menuBurger = document.querySelector('.menu__burger');
const lineBarWidth = 100 / slides.length;

let goShowNum = 0;
let openNum = 1;
let offOnNum = 0;
let openI = 0;
let openI2 = 0;

if (numSlides != null) {
  numSlides.textContent = slides.length;

  lineBar.style.width = `${lineBarWidth}%`;
}

function open() {
  openI = 0;
  if (openNum === 0) {
    tеxtlogo.style.display = 'none';
    arrow.style.transform = 'rotate(180deg)';
    menu.style.width = '67px';
    openNum = 1;
    openI = 0;
    GoNon.forEach(() => {
      GoNon[openI].style.display = 'none';
      openI += 1;
    });
    openI = 0;
    GoNon2.forEach(() => {
      GoNon2[openI].style.display = 'none';
      openI += 1;
    });
  } else {
    tеxtlogo.style.display = 'block';
    arrow.style.transform = 'rotate(0deg)';
    menu.style.width = '201px';
    openNum = 0;
    openI = 0;
    GoNon.forEach(() => {
      GoNon[openI].style.display = 'block';
      openI += 1;
    });
    openI = 0;
    GoNon2.forEach(() => {
      GoNon2[openI].style.display = 'block';
      openI += 1;
    });
  }
}

function open2() {
  openI = 0;
  menuBurger.classList.toggle('BurgerLock');
  if (openNum === 0) {
    tеxtlogo.style.display = 'none';
    menu.style.width = '0px';
    openNum = 1;
    openI = 0;
    GoNon.forEach(() => {
      GoNon[openI].style.display = 'none';
      openI += 1;
    });
    openI = 0;
    GoNon2.forEach(() => {
      GoNon2[openI].style.display = 'none';
      openI += 1;
    });
  } else {
    tеxtlogo.style.display = 'block';
    menu.style.width = '201px';
    openNum = 0;
    openI = 0;
    GoNon.forEach(() => {
      GoNon[openI].style.display = 'block';
      openI += 1;
    });
    openI = 0;
    GoNon2.forEach(() => {
      GoNon2[openI].style.display = 'block';
      openI += 1;
    });
  }
}

function offOn() {
  if (offOnNum === 0) {
    itemOff.style.display = 'flex';
    itemOn.style.display = 'none';
    offOnNum = 1;
  } else {
    itemOff.style.display = 'none';
    itemOn.style.display = 'flex';
    offOnNum = 0;
  }
}

if (numSlides != null) {
  prev.addEventListener('click', () => {
    const gggg = lineBar.style.width;
    lineBar.style.width = `${Number(gggg.slice(0, -1)) - lineBarWidth}%`;
  });
  next.addEventListener('click', () => {
    const gggg = lineBar.style.width;
    lineBar.style.width = `${Number(gggg.slice(0, -1)) + lineBarWidth}%`;
  });
}

arrow.addEventListener('click', open);
itemOff.addEventListener('click', offOn);
itemOn.addEventListener('click', offOn);
menuBurger.addEventListener('click', open2);

accordionShow.forEach(() => {
  accordionShow[openI2].addEventListener('click', () => {
    if (goShowNum === 0) {
      goShow[openI].style.maxHeight = '200px';
      goShowNum = 1;
      openI += 1;
    } else {
      goShow[openI].style.maxHeight = '0px';
      goShowNum = 0;
      openI += 1;
    }
    openI = 0;
    openI2 += 1;
  });
  openI2 = 0;
});

const currentSlide = document.querySelector('.bar-block__numone');
currentSlide.textContent = render.mySwiper.activeIndex;

const login = new Login('#login');
const registration = new Registration('#registration');
// eslint shows errors without console.log (no-unused-vars)
console.log(login);
console.log(registration);

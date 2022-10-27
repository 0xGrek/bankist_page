'use strict';

// Modal window
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const header = document.querySelector(`.header`);
const nav = document.querySelector(`.nav`);

const tabsContainer = document.querySelector(`.operations__tab-container`);
const tabs = document.querySelectorAll(`.operations__tab`);
const tabsContent = document.querySelectorAll(`.operations__content`);

const allSections = document.querySelectorAll(`.section`);
const section1 = document.querySelector(`#section--1`);
const section2 = document.querySelector(`#section--2`);

const imgTarget = document.querySelectorAll(`img[data-src]`);

const btnScrollTo = document.querySelector(`.btn--scroll-to`);

///////////////////////////////////////
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

// Button scrolling
btnScrollTo.addEventListener(`click`, function (e) {
  const s1coords = section1.getBoundingClientRect();
  //examination
  // console.log(s1coords);
  // console.log(
  //   `height/width viewport`,
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );
  //console.log(e.target.getBoundingClientRect());  distance betwen cur el and top line

  window.scrollTo({
    left: s1coords.left + window.pageXOffset, // curr el + cer scroll
    top: s1coords.top + window.pageYOffset,
    behavior: `smooth`,
  });
  // ANOTHER WAY
  // section1.scrollIntoView({ behavior: `smooth` });
});
// *Another way
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);
btnsOpenModal.forEach(btn => btn.addEventListener(`click`, openModal));

//Page navigation
// Another Way -  event delegetion
// 1. Add event listener to commot parent el
// 2. Detemine that el originated the event
// ****************** Этот вариант хуже, если много links
// document.querySelectorAll(`.nav__link`).forEach(function (el) {
//   el.addEventListener(`click`, function (e) {
//     e.preventDefault();
//     const id = this.getAttribute(`href`); //берем селектор у елемента
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: `smooth` });
//   });
// });
document.querySelector(`.nav__links`).addEventListener(`click`, function (e) {
  e.preventDefault();
  // Matching strategy/ сопоставляем информацию
  if (e.target.classList.contains(`nav__link`)) {
    const id = e.target.getAttribute(`href`);
    document.querySelector(id).scrollIntoView({ behavior: `smooth` });
  }
});

// Tabbed component
tabsContainer.addEventListener(`click`, function (e) {
  const clicked = e.target.closest(`.operations__tab`);
  // ignore click outside
  if (!clicked) return;
  // Remove tab
  tabs.forEach(t => t.classList.remove(`operations__tab--active`));
  tabsContent.forEach(c => c.classList.remove(`operations__content--active`));
  // Activated tab
  clicked.classList.add(`operations__tab--active`);
  // Content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add(`operations__content--active`);
});

// Menu fade animations
const handleHover = function (e) {
  if (e.target.classList.contains(`nav__link`)) {
    const link = e.target;
    const siblings = link.closest(`.nav`).querySelectorAll(`.nav__link`);
    const logo = link.closest(`.nav`).querySelector(`img`);

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passigng the argument into handler
// nav.addEventListener(`mouseout`, function (e) {
//   handleHover(e, 1);
// });
nav.addEventListener(`mouseover`, handleHover.bind(0.5));
nav.addEventListener(`mouseout`, handleHover.bind(1));

// Sticky nav with API
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);
// Sticky navigation another way
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);
// window.addEventListener(`scroll`, function (e) {
//   console.log(window.scrollY);
//   if (window.scrollY > initialCoords.top) nav.classList.add(`sticky`);
//   else nav.classList.remove(`sticky`);
// });
const navHeight = nav.getBoundingClientRect().height; // responsive height
const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add(`sticky`);
  else nav.classList.remove(`sticky`);
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Reveal section
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove(`section--hidden`);
  //cancel if we scroll up
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.1,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add(`section--hidden`);
});

// Lazy loading img
// 3.
const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener(`load`, function () {
    entry.target.classList.remove(`lazy-img`);
  });
  observer.unobserve(entry.target);
};
// 2.
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: `-100px`,
});
// 1.
imgTarget.forEach(img => imgObserver.observe(img));

// Slider
const slider = function () {
  const slides = document.querySelectorAll(`.slide`);
  const btnLeft = document.querySelector(`.slider__btn--left`);
  const btnRight = document.querySelector(`.slider__btn--right`);
  const slider = document.querySelector(`.slider`);
  const dotContainer = document.querySelector(`.dots`);

  let curSlide = 0;
  const maxSlide = slides.length;

  // fucntions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next arows
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };
  // init
  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();
  // Event handlers
  btnRight.addEventListener(`click`, nextSlide);
  btnLeft.addEventListener(`click`, prevSlide);

  document.addEventListener(`keydown`, function (e) {
    console.log(e);
    if (e.key === `ArrowLeft`) prevSlide();
    e.key === `ArrowRight` && nextSlide();
  });

  dotContainer.addEventListener(`click`, function (e) {
    if (e.target.classList.contains(`dots__dot`)) {
      const slide = e.target.dataset.slide;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
/////////////////////////////////////
console.log(`//////////////////////////////////`);
////////////////////////////////////
//Page navaigation

// *************PRACTIC*****************
// const message = document.createElement(`div`);
// message.classList.add(`cookie-message`);
// message.innerHTML = `we use so HTML
// <button class="btn btn--close-coolie">Go it!</button>`;
// // header.prepend(message);
// header.append(message);
// header.append(message.cloneNode(true));
// document
//   .querySelector(`.btn--close-cookie`)
//   .addEventListener(`click`, function () {
//     message.remove();
//   });
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();
//     // message.parentElement.removeChild(message);
//   });

// 187
// Styles
// message.style.backgroundColor = `#37383d`;
// message.style.width = `120%`;

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 70) + 30 + 'px';

// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);

// document.documentElement.style.setProperty(`--color-primary`, `orangered`);

// Atributes
// const logo = document.querySelector(`.nav__logo`);
// logo.alt = `Minimun`;
// logo.getAttribute(`designer`);
// console.log(logo.alt);
// console.log(logo.src);
// logo.getAttribute(`src`);

// если хотим получть аблолютный(relative) путь src
// console.log(logo.getAttribute(`src`));
// const link = document.querySelector(`.twitter-link`);
// console.log(link.href);
// console.log(link.getAttribute(`href`));

// data когда работаем с UI it need
// console.log(logo.dataset.versionNumber);

// Classes
// logo.classList.add(`c`);
// logo.classList.remove(`c`);
// logo.classList.toggle(`c`); // чередовать класс
// logo.classList.contains(`c`);

// // Non-standard
// console.log(logo.designer);
// console.log(logo.getAttribute('designer'));
// logo.setAttribute('company', 'Bankist');

// const h1 = document.querySelector(`h1`);
// h1.addEventListener(`mouseenter`, function (e) {
//   alert(`addEventListener: Great! You are reading the head/`);
// });

// 191

// random number
// const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1));

// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
// console.log(randomColor(0, 255));

// document.querySelector(`.nav__link`).addEventListener(`click`, function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log(`LINK`);
// });

// document.querySelector(`.nav__links`).addEventListener(`click`, function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log(`CONT`);
// });

// document.querySelector(`.nav`).addEventListener(
//   `click`,
//   function (e) {
//     this.style.backgroundColor = randomColor();
//     console.log(`NAV`);
//   },
//   false
// );
// perents node, going down
// const h1 = document.querySelector(`h1`);
/*
console.log(h1.querySelectorAll(`.highlight`));

console.log(h1.childNodes);
console.log(h1.children);
 */
// going upwords
/*
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest(`.header1`).style.background = `var(--color-primary)`; 
*/
// going siblings
/*
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)';
});

 */

document.addEventListener(`DOMContentLoaded`, function (e) {
  console.log(`HTML parsed tree`, e);
});

window.addEventListener(`load`, function (e) {
  console.log(`fuul page`, e);
});

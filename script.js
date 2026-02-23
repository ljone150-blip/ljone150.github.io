/* ===========================
   GLOBAL VARIABLES
=========================== */
const fadeElements = document.querySelectorAll('.fade-in');
const slideElements = document.querySelectorAll('.slide-up');

/* ===========================
   SCROLL ANIMATIONS
=========================== */
function revealOnScroll() {
  fadeElements.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 50) {
      el.classList.add('visible');
    }
  });

  slideElements.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 50) {
      el.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

/* ===========================
   UPCOMING PAGE LIGHTBOX
=========================== */
const lightbox = document.getElementById('lightbox');
const bookPagesWrapper = lightbox.querySelector('.book-page-wrapper');
const closeBtn = lightbox.querySelector('.close');
const prevBtn = lightbox.querySelector('.prev');
const nextBtn = lightbox.querySelector('.next');

let currentIndex = 0;
let currentBookData = [];

// Show a specific book page
function showPage(index) {
  const bookData = currentBookData[index];
  const bookPageHTML = `
    <div class="book-page">
      <div class="book-left">
        <img src="${bookData.imgSrc}" alt="${bookData.title}">
      </div>
      <div class="book-right">
        <div class="book-synopsis">${bookData.synopsis}</div>
      </div>
    </div>
  `;
  bookPagesWrapper.innerHTML = bookPageHTML;
  currentIndex = index;
}

// Clicking a cover opens the lightbox
document.querySelectorAll('.cover-wrapper').forEach(wrapper => {
  wrapper.addEventListener('click', () => {
    const index = parseInt(wrapper.dataset.index);
    const img = wrapper.querySelector('img');
    const synopsis = img.dataset.synopsis;

    currentBookData = [
      { imgSrc: img.src, title: img.alt, synopsis }
    ];

    showPage(index);
    lightbox.style.display = 'flex';
  });
});

// Close lightbox
closeBtn.addEventListener('click', () => {
  lightbox.style.display = 'none';
});

// Navigation arrows
prevBtn.addEventListener('click', () => {
  const newIndex = (currentIndex - 1 + currentBookData.length) % currentBookData.length;
  showPage(newIndex);
});

nextBtn.addEventListener('click', () => {
  const newIndex = (currentIndex + 1) % currentBookData.length;
  showPage(newIndex);
});

// Close lightbox if clicking outside content
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) lightbox.style.display = 'none';
});

/* ===========================
   LIGHTBOX CONFIGURATION
=========================== */
const lightboxes = document.querySelectorAll('.lightbox');

lightboxes.forEach(lightbox => {
  const bookPagesWrapper = lightbox.querySelector('.book-page-wrapper');
  const closeBtn = lightbox.querySelector('.close');
  const prevBtn = lightbox.querySelector('.prev');
  const nextBtn = lightbox.querySelector('.next');
  let currentIndex = 0;
  let currentBookData = [];

  // Show specific book page
  function showPage(index) {
    const bookData = currentBookData[index];
    const bookPageHTML = `
      <div class="book-page">
        <div class="book-left">
          <img src="${bookData.imgSrc}" alt="${bookData.title}">
        </div>
        <div class="book-right">
          <div class="book-synopsis">${bookData.synopsis}</div>
        </div>
      </div>
    `;
    bookPagesWrapper.innerHTML = bookPageHTML;
    currentIndex = index;
  }

  // Trigger lightbox opening
  const coverWrappers = lightbox.closest('.upcoming-page') ? document.querySelectorAll('.cover-wrapper') : document.querySelectorAll('.blog-post');
  
  coverWrappers.forEach(wrapper => {
    wrapper.addEventListener('click', () => {
      const index = parseInt(wrapper.dataset.index);
      const img = wrapper.querySelector('img');
      const synopsis = img.dataset.synopsis;

      currentBookData = [
        { imgSrc: img.src, title: img.alt, synopsis }
      ];

      showPage(index);
      lightbox.style.display = 'flex';
    });
  });

  // Close lightbox
  closeBtn.addEventListener('click', () => {
    lightbox.style.display = 'none';
  });

  // Navigation buttons
  prevBtn.addEventListener('click', () => {
    const newIndex = (currentIndex - 1 + currentBookData.length) % currentBookData.length;
    showPage(newIndex);
  });

  nextBtn.addEventListener('click', () => {
    const newIndex = (currentIndex + 1) % currentBookData.length;
    showPage(newIndex);
  });

  // Close lightbox if clicking outside content
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) lightbox.style.display = 'none';
  });
});

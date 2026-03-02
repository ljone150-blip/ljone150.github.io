/* ===========================
   GLOBAL VARIABLES
=========================== */
const fadeElements = document.querySelectorAll('.fade-in');
const slideElements = document.querySelectorAll('.slide-up');

function isMobileView() {
  return window.innerWidth <= 768;
}

/* ===========================
   SCROLL ANIMATIONS
=========================== */
function revealOnScroll() {
  const triggerPoint = window.innerHeight - 50;

  fadeElements.forEach(el => {
    if (el.getBoundingClientRect().top < triggerPoint) {
      el.classList.add('visible');
    }
  });

  slideElements.forEach(el => {
    if (el.getBoundingClientRect().top < triggerPoint) {
      el.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

/* ===========================
   DOM READY
=========================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ===========================
     WRITER'S CORNER GRID
  =========================== */
  const blogGrid = document.querySelector('.writers-page .blog-grid');
  if (blogGrid) {

    blogGrid.style.transition = 'grid-row-end 0.3s ease';

    // Shuffle Posts
    const shufflePosts = container => {
      const posts = Array.from(container.children);
      for (let i = posts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        container.appendChild(posts[j]);
        posts.splice(j, 1);
      }
    };
    shufflePosts(blogGrid);

    // Masonry grid calculation
    const recalcGridItem = item => {
      const styles = getComputedStyle(blogGrid);
      const rowHeight = parseInt(styles.getPropertyValue('grid-auto-rows')) || 10;
      const gap = parseInt(styles.getPropertyValue('gap')) || 20;
      item.style.gridRowEnd = null;
      const span = Math.ceil((item.offsetHeight + gap) / (rowHeight + gap));
      item.style.gridRowEnd = `span ${span}`;
    };

    const recalcGrid = () => {
      blogGrid.querySelectorAll('.blog-post').forEach(item => recalcGridItem(item));
    };
    window.addEventListener('load', recalcGrid);
    window.addEventListener('resize', recalcGrid);

    // Read More / Show Less
    blogGrid.querySelectorAll('.blog-post.short').forEach(post => {
      const contentWrapper = post.querySelector('.short-preview-wrapper');
      const readMoreBtn = post.querySelector('.read-more-btn');
      if (!contentWrapper || !readMoreBtn) return;

      const maxLines = 5, lineHeight = 24;
      contentWrapper.style.maxHeight = `${maxLines * lineHeight}px`;
      contentWrapper.style.overflow = 'hidden';
      contentWrapper.style.transition = 'max-height 0.3s ease';

      readMoreBtn.addEventListener('click', () => {
        const isExpanded = contentWrapper.classList.contains('expanded');
        if (isExpanded) {
          contentWrapper.style.maxHeight = `${maxLines * lineHeight}px`;
          contentWrapper.classList.remove('expanded');
          readMoreBtn.innerText = 'Read More';
        } else {
          contentWrapper.style.maxHeight = contentWrapper.scrollHeight + 'px';
          contentWrapper.classList.add('expanded');
          readMoreBtn.innerText = 'Show Less';
        }
        contentWrapper.addEventListener('transitionend', () => recalcGridItem(post), { once: true });
      });
    });

    // Hover label for long posts
    const longPosts = blogGrid.querySelectorAll('.blog-post.long');
    longPosts.forEach(post => {
      const imgWrapper = post.querySelector('.post-image-wrapper');
      if (!imgWrapper) return;
      const hoverLabel = document.createElement('div');
      hoverLabel.className = 'cover-hover-label';
      hoverLabel.innerText = 'Click for more';
      imgWrapper.style.position = 'relative';
      imgWrapper.appendChild(hoverLabel);
      imgWrapper.addEventListener('mouseenter', () => hoverLabel.style.opacity = 1);
      imgWrapper.addEventListener('mouseleave', () => hoverLabel.style.opacity = 0);
    });

    /* ===========================
       WRITERS CORNER LIGHTBOX
    =========================== */
    const wcLightbox = document.getElementById('wc-lightbox');
    if (wcLightbox && longPosts.length) {

      (function () {
        const bookPagesWrapper = wcLightbox.querySelector('.book-page-wrapper');
        const closeBtn = wcLightbox.querySelector('.close');
        const prevBtn = wcLightbox.querySelector('.prev');
        const nextBtn = wcLightbox.querySelector('.next');

        let wcCurrentBookIndex = 0;
        let wcCurrentSpreadIndex = 0;
        let wcBooks = [];
        let wcIsOpen = false;

        // Split book content into pages
        const paginateText = (htmlString, paragraphsPerPage = 5) => {
          const temp = document.createElement('div');
          temp.innerHTML = htmlString;
          const paragraphs = Array.from(temp.children);
          const pages = [];
          for (let i = 0; i < paragraphs.length; i += paragraphsPerPage) {
            pages.push(paragraphs.slice(i, i + paragraphsPerPage).map(p => p.outerHTML).join(''));
          }
          return pages;
        };

        wcBooks = Array.from(longPosts).map(post => {
          const imgSrc = post.querySelector('img')?.src || '';
          const title = post.querySelector('h3')?.innerText || '';
          const fullText = post.dataset.fullContent || '';
          const pages = paginateText(fullText);
          return { cover: imgSrc, title, pages };
        });

        function renderSpread() {
          const book = wcBooks[wcCurrentBookIndex];
          if (!book) return;

          if (isMobileView()) {
            if (wcCurrentSpreadIndex === 0) {
              bookPagesWrapper.innerHTML = `<div class="wc-book"><div class="wc-spread"><div class="wc-page cover-page"><img src="${book.cover}" alt="${book.title}"></div></div></div>`;
            } else {
              const pageText = book.pages[wcCurrentSpreadIndex - 1] || '';
              bookPagesWrapper.innerHTML = `<div class="wc-book"><div class="wc-spread"><div class="wc-page text-page"><div class="wc-page-inner">${pageText}</div></div></div></div>`;
            }
          } else {
            const leftText = book.pages[(wcCurrentSpreadIndex - 1) * 2] || '';
            const rightText = book.pages[(wcCurrentSpreadIndex - 1) * 2 + 1] || '';
            const leftContent = wcCurrentSpreadIndex === 0 ? `<div class="wc-page blank-page"></div>` : `<div class="wc-page text-page"><div class="wc-page-inner">${leftText}</div></div>`;
            const rightContent = wcCurrentSpreadIndex === 0 ? `<div class="wc-page cover-page"><img src="${book.cover}" alt="${book.title}"></div>` : `<div class="wc-page text-page"><div class="wc-page-inner">${rightText}</div></div>`;
            bookPagesWrapper.innerHTML = `<div class="wc-book"><div class="wc-spread">${leftContent}${rightContent}</div></div>`;
          }
        }

        function nextSpread() { wcCurrentSpreadIndex++; renderSpread(); }
        function prevSpread() { wcCurrentSpreadIndex = Math.max(0, wcCurrentSpreadIndex - 1); renderSpread(); }

        longPosts.forEach((post, index) => {
          post.addEventListener('click', () => {
            wcCurrentBookIndex = index;
            wcCurrentSpreadIndex = 0;
            renderSpread();
            wcLightbox.style.display = 'flex';
            document.body.classList.add('lightbox-open');
          });
        });

        closeBtn.addEventListener('click', () => { wcLightbox.style.display = 'none'; document.body.classList.remove('lightbox-open'); });
        nextBtn.addEventListener('click', nextSpread);
        prevBtn.addEventListener('click', prevSpread);

      })();
    }
  }

  /* ===========================
     UPCOMING PAGE LIGHTBOX
  =========================== */
  const upcomingSection = document.querySelector('.upcoming-page');
  if (upcomingSection) {

    const lightbox = upcomingSection.querySelector('#lightbox');
    if (!lightbox) return;

    (function () {

      const bookPagesWrapper = lightbox.querySelector('.book-page-wrapper');
      const closeBtn = lightbox.querySelector('.close');
      const prevBtn = lightbox.querySelector('.prev');
      const nextBtn = lightbox.querySelector('.next');
      const coverWrappers = upcomingSection.querySelectorAll('.cover-wrapper');

      let upCurrentIndex = 0;
      let upIsOpen = false;
      let mobileTextVisible = false;

      const currentBookData = Array.from(coverWrappers)
        .map(wrapper => {
          const img = wrapper.querySelector('img');
          if (!img) return null;
          return {
            imgSrc: img.src,
            title: img.alt,
            synopsis: img.dataset.synopsis || ''
          };
        }).filter(Boolean);

      const showPage = (index, mobileTextMode = false) => {
        const bookData = currentBookData[index];
        if (!bookData) return;

        let synopsis = bookData.synopsis
          .replace(/her name/g, '<span class="highlight">her name</span>')
          .replace(/his purpose/g, '<span class="highlight">his purpose</span>');

        if (isMobileView()) {
          if (!mobileTextMode) {
            bookPagesWrapper.innerHTML = `<div class="book-page"><div class="book-left" style="width:100%"><img src="${bookData.imgSrc}" alt="${bookData.title}"></div></div>`;
          } else {
            bookPagesWrapper.innerHTML = `<div class="book-page"><div class="book-right" style="width:100%"><div class="book-synopsis centered">${synopsis}</div></div></div>`;
          }
        } else {
          bookPagesWrapper.innerHTML = `<div class="book-page"><div class="book-left"><img src="${bookData.imgSrc}" alt="${bookData.title}"></div><div class="book-right"><div class="book-synopsis centered">${synopsis}</div></div></div>`;
        }

        upCurrentIndex = index;
      };

      function handleUpKeydown(e) {
        if (!upIsOpen) return;
        if (e.key === 'ArrowRight') nextBtn.click();
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'Escape') closeLightbox();
      }

      const closeLightbox = () => {
        lightbox.style.opacity = 0;
        lightbox.addEventListener('transitionend', function handler() {
          lightbox.style.display = 'none';
          document.body.classList.remove('lightbox-open');
          lightbox.removeEventListener('transitionend', handler);
        });
        upIsOpen = false;
        document.removeEventListener('keydown', handleUpKeydown);
      };

      coverWrappers.forEach((wrapper, index) => {
        wrapper.addEventListener('click', () => {
          showPage(index);
          mobileTextVisible = false;
          lightbox.style.opacity = 0;
          lightbox.style.display = 'flex';
          document.body.classList.add('lightbox-open');
          requestAnimationFrame(() => { lightbox.style.transition = 'opacity 0.3s ease'; lightbox.style.opacity = 1; });
          upIsOpen = true;
          document.addEventListener('keydown', handleUpKeydown);
        });

        const hoverLabel = document.createElement('div');
        hoverLabel.className = 'cover-hover-label';
        hoverLabel.innerText = 'Click for more';
        wrapper.style.position = 'relative';
        wrapper.appendChild(hoverLabel);
        wrapper.addEventListener('mouseenter', () => hoverLabel.style.opacity = 1);
        wrapper.addEventListener('mouseleave', () => hoverLabel.style.opacity = 0);
      });

      prevBtn.addEventListener('click', () => {
        if (isMobileView()) {
          if (mobileTextVisible) {
            mobileTextVisible = false;
            showPage(upCurrentIndex, false);
          } else {
            upCurrentIndex = (upCurrentIndex - 1 + currentBookData.length) % currentBookData.length;
            showPage(upCurrentIndex, false);
          }
        } else {
          showPage((upCurrentIndex - 1 + currentBookData.length) % currentBookData.length);
        }
      });

      nextBtn.addEventListener('click', () => {
        if (isMobileView()) {
          if (!mobileTextVisible) {
            mobileTextVisible = true;
            showPage(upCurrentIndex, true);
          } else {
            mobileTextVisible = false;
            upCurrentIndex = (upCurrentIndex + 1) % currentBookData.length;
            showPage(upCurrentIndex, false);
          }
        } else {
          showPage((upCurrentIndex + 1) % currentBookData.length);
        }
      });

      closeBtn.addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

    })();
  }

  /* ===========================
     LOVE BUTTONS
  =========================== */
  document.querySelectorAll('.love-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const count = btn.querySelector('.love-count');
      if (!count) return;
      count.textContent = parseInt(count.textContent) + 1;
    });
  });

  /* ===========================
     COMMENT TOGGLE
  =========================== */
  document.querySelectorAll('.toggle-comments').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const post = btn.closest('.blog-post');
      if (!post) return;
      const commentSection = post.querySelector('.comment-section');
      if (!commentSection) return;
      commentSection.style.display = commentSection.style.display === 'block' ? 'none' : 'block';
    });
  });

  /* ===========================
     SUBMIT COMMENTS
  =========================== */
  document.querySelectorAll('.submit-comment').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const section = btn.closest('.comment-section');
      if (!section) return;
      const textarea = section.querySelector('textarea');
      const container = section.querySelector('.comments-container');
      if (!textarea || !container) return;
      const text = textarea.value.trim();
      if (text === '') return;
      const comment = document.createElement('p');
      comment.innerHTML = text;
      container.appendChild(comment);
      textarea.value = '';
    });
  });

});

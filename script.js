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
   WRITER'S CORNER GRID & LIGHTBOX
=========================== */
document.addEventListener('DOMContentLoaded', () => {
  const blogGrid = document.querySelector('.writers-page .blog-grid');

  if (!blogGrid) return;

  blogGrid.style.transition = 'grid-row-end 0.3s ease';

  // -----------------------------
  // Shuffle Posts
  // -----------------------------
  const shufflePosts = container => {
    const posts = Array.from(container.children);
    for (let i = posts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      container.appendChild(posts[j]);
      posts.splice(j, 1);
    }
  };
  shufflePosts(blogGrid);

  // -----------------------------
  // Masonry Grid Recalculation
  // -----------------------------
  const recalcGridItem = item => {
    const styles = getComputedStyle(blogGrid);
    const rowHeight = parseInt(styles.getPropertyValue('grid-auto-rows')) || 10;
    const gap = parseInt(styles.getPropertyValue('gap')) || 20;

    item.style.gridRowEnd = null;

    const span = Math.ceil((item.offsetHeight + gap) / (rowHeight + gap));
    item.style.gridRowEnd = `span ${span}`;
  };

  const recalcGrid = () => {
    blogGrid.querySelectorAll('.blog-post').forEach(recalcGridItem);
  };

  window.addEventListener('load', recalcGrid);
  window.addEventListener('resize', recalcGrid);

  // -----------------------------
  // Read More / Show Less
  // -----------------------------
  blogGrid.querySelectorAll('.blog-post.short').forEach(post => {
    const contentWrapper = post.querySelector('.short-preview-wrapper');
    const readMoreBtn = post.querySelector('.read-more-btn');
    if (!contentWrapper || !readMoreBtn) return;

    const maxHeight = 5 * 24; // 5 lines * line-height
    contentWrapper.style.maxHeight = `${maxHeight}px`;
    contentWrapper.style.overflow = 'hidden';
    contentWrapper.style.transition = 'max-height 0.3s ease';

    readMoreBtn.addEventListener('click', () => {
      const isExpanded = contentWrapper.classList.contains('expanded');
      contentWrapper.style.maxHeight = isExpanded ? `${maxHeight}px` : `${contentWrapper.scrollHeight}px`;
      contentWrapper.classList.toggle('expanded');
      readMoreBtn.innerText = isExpanded ? 'Read More' : 'Show Less';

      contentWrapper.addEventListener('transitionend', function handler() {
        recalcGridItem(post);
        contentWrapper.removeEventListener('transitionend', handler);
      });
    });
  });

  // -----------------------------
  // Long Post Hover Labels
  // -----------------------------
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

  // -----------------------------
  // Writer's Corner Lightbox
  // -----------------------------
  const wcLightbox = document.getElementById('wc-lightbox');
  if (wcLightbox && longPosts.length) {
    (function () {
      const bookPagesWrapper = wcLightbox.querySelector('.book-page-wrapper');
      const closeBtn = wcLightbox.querySelector('.close');
      const prevBtn = wcLightbox.querySelector('.prev');
      const nextBtn = wcLightbox.querySelector('.next');

      let wcCurrentBookIndex = 0;
      let wcCurrentSpreadIndex = 0;
      let wcIsOpen = false;

      const wcBooks = Array.from(longPosts).map(post => {
        const imgSrc = post.querySelector('img')?.src || '';
        const title = post.querySelector('h3')?.innerText || '';
        const fullText = post.dataset.fullContent || '';
        const pages = [];
        const temp = document.createElement('div');
        temp.innerHTML = fullText;
        const paragraphs = Array.from(temp.children);
        for (let i = 0; i < paragraphs.length; i += 5) {
          pages.push(paragraphs.slice(i, i + 5).map(p => p.outerHTML).join(''));
        }
        return { cover: imgSrc, title, pages };
      });

      const renderSpread = (withFlip = true, direction = 'next') => {
        const book = wcBooks[wcCurrentBookIndex];
        if (!book) return;

        let leftContent, rightContent;

        if (wcCurrentSpreadIndex === 0) {
          leftContent = `<div class="wc-page blank-page"></div>`;
          rightContent = `<div class="wc-page cover-page"><img src="${book.cover}" alt="${book.title}"></div>`;
        } else {
          const pageIndex = (wcCurrentSpreadIndex - 1) * 2;
          const leftText = book.pages[pageIndex] || '';
          const rightText = book.pages[pageIndex + 1] || '';
          leftContent = `<div class="wc-page text-page"><div class="wc-page-inner">${leftText}</div></div>`;
          rightContent = `<div class="wc-page text-page"><div class="wc-page-inner">${rightText}</div></div>`;
        }

        bookPagesWrapper.innerHTML = `<div class="wc-book ${withFlip ? 'flip-' + direction : ''}"><div class="wc-spread">${leftContent}${rightContent}</div></div>`;
      };

      const nextSpread = () => {
        const book = wcBooks[wcCurrentBookIndex];
        const maxSpreads = Math.ceil(book.pages.length / 2);
        wcCurrentSpreadIndex = wcCurrentSpreadIndex < maxSpreads ? wcCurrentSpreadIndex + 1 : 0;
        renderSpread(true, 'next');
      };

      const prevSpread = () => {
        const book = wcBooks[wcCurrentBookIndex];
        const maxSpreads = Math.ceil(book.pages.length / 2);
        wcCurrentSpreadIndex = wcCurrentSpreadIndex > 0 ? wcCurrentSpreadIndex - 1 : maxSpreads;
        renderSpread(true, 'prev');
      };

      const handleWCKeydown = e => {
        if (!wcIsOpen) return;
        if (e.key === 'ArrowRight') nextSpread();
        if (e.key === 'ArrowLeft') prevSpread();
        if (e.key === 'Escape') closeWCLightbox();
      };

      const openWCLightbox = index => {
        wcCurrentBookIndex = index;
        wcCurrentSpreadIndex = 0;
        renderSpread(false);
        wcLightbox.style.display = 'flex';
        wcLightbox.style.opacity = 0;
        document.body.classList.add('lightbox-open');

        requestAnimationFrame(() => {
          wcLightbox.style.transition = 'opacity 0.3s ease';
          wcLightbox.style.opacity = 1;
        });

        wcIsOpen = true;
        document.addEventListener('keydown', handleWCKeydown);
      };

      const closeWCLightbox = () => {
        wcLightbox.style.transition = 'opacity 0.3s ease';
        wcLightbox.style.opacity = 0;
        wcLightbox.addEventListener('transitionend', function handler() {
          wcLightbox.style.display = 'none';
          document.body.classList.remove('lightbox-open');
          wcLightbox.removeEventListener('transitionend', handler);
        });
        wcIsOpen = false;
        document.removeEventListener('keydown', handleWCKeydown);
      };

      longPosts.forEach((post, index) => {
        post.addEventListener('click', e => {
          if (e.target.closest('.post-actions') || e.target.closest('.comment-section')) return;
          openWCLightbox(index);
        });
      });

      nextBtn.addEventListener('click', nextSpread);
      prevBtn.addEventListener('click', prevSpread);
      closeBtn.addEventListener('click', closeWCLightbox);

      wcLightbox.addEventListener('click', e => {
        if (e.target === wcLightbox) closeWCLightbox();
      });
    })();
  }

  /* ===========================
     UPCOMING PAGE LIGHTBOX
  =========================== */
  const upcomingSection = document.querySelector('.upcoming-page');
  if (!upcomingSection) return;

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

    const currentBookData = Array.from(coverWrappers)
      .map(wrapper => {
        const img = wrapper.querySelector('img');
        if (!img) return null;
        return { imgSrc: img.src, title: img.alt, synopsis: img.dataset.synopsis || '' };
      }).filter(Boolean);

    const showPage = (index, mobileTextMode = false) => {
      const book = currentBookData[index];
      if (!book) return;

      let synopsis = book.synopsis
        .replace(/her name/g, '<span class="highlight">her name</span>')
        .replace(/his purpose/g, '<span class="highlight">his purpose</span>');

      if (isMobileView()) {
        if (!mobileTextMode) {
          bookPagesWrapper.innerHTML = `<div class="book-page"><div class="book-left" style="width:100%"><img src="${book.imgSrc}" alt="${book.title}"></div></div>`;
        } else {
          bookPagesWrapper.innerHTML = `<div class="book-page"><div class="book-right" style="width:100%"><div class="book-synopsis centered">${synopsis}</div></div></div>`;
        }
      } else {
        bookPagesWrapper.innerHTML = `<div class="book-page"><div class="book-left"><img src="${book.imgSrc}" alt="${book.title}"></div><div class="book-right"><div class="book-synopsis centered">${synopsis}</div></div></div>`;
      }

      upCurrentIndex = index;
    };

    const handleUpKeydown = e => {
      if (!upIsOpen) return;
      if (e.key === 'ArrowRight') showPage((upCurrentIndex + 1) % currentBookData.length);
      if (e.key === 'ArrowLeft') showPage((upCurrentIndex - 1 + currentBookData.length) % currentBookData.length);
      if (e.key === 'Escape') closeLightbox();
    };

    const closeLightbox = () => {
      lightbox.style.transition = 'opacity 0.3s ease';
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
      const hoverLabel = document.createElement('div');
      hoverLabel.className = 'cover-hover-label';
      hoverLabel.innerText = 'Click for more';
      wrapper.style.position = 'relative';
      wrapper.appendChild(hoverLabel);

      wrapper.addEventListener('mouseenter', () => hoverLabel.style.opacity = 1);
      wrapper.addEventListener('mouseleave', () => hoverLabel.style.opacity = 0);

      wrapper.addEventListener('click', () => {
        showPage(index);
        lightbox.style.display = 'flex';
        lightbox.style.opacity = 0;
        document.body.classList.add('lightbox-open');
        requestAnimationFrame(() => {
          lightbox.style.transition = 'opacity 0.3s ease';
          lightbox.style.opacity = 1;
        });
        upIsOpen = true;
        document.addEventListener('keydown', handleUpKeydown);
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

    let mobileTextVisible = false;

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
  })();
});

/* ===========================
   LOVE BUTTONS
=========================== */
document.querySelectorAll('.love-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const count = btn.querySelector('.love-count');
    if (!count) return;
    count.textContent = parseInt(count.textContent) + 1;
  });
});

/* ===========================
   COMMENT TOGGLE & SUBMIT
=========================== */
document.querySelectorAll('.toggle-comments').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const post = btn.closest('.blog-post');
    if (!post) return;
    const section = post.querySelector('.comment-section');
    if (!section) return;
    section.style.display = section.style.display === 'block' ? 'none' : 'block';
  });
});

document.querySelectorAll('.submit-comment').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const section = btn.closest('.comment-section');
    if (!section) return;
    const textarea = section.querySelector('textarea');
    const container = section.querySelector('.comments-container');
    if (!textarea || !container) return;
    const text = textarea.value.trim();
    if (!text) return;
    const comment = document.createElement('p');
    comment.innerHTML = text;
    container.appendChild(comment);
    textarea.value = '';
  });
});

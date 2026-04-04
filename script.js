// =============================================
//   ValidateX — Slide Navigation Engine
// =============================================

const TOTAL_SLIDES = 7;
let currentSlide = 0;
let isAnimating = false;

const slides      = document.querySelectorAll('.slide');
const prevBtn     = document.getElementById('prevBtn');
const nextBtn     = document.getElementById('nextBtn');
const dotsWrapper = document.getElementById('slideDots');

// --- BUILD DOTS ---
function buildDots() {
  dotsWrapper.innerHTML = '';
  for (let i = 0; i < TOTAL_SLIDES; i++) {
    const dot = document.createElement('button');
    dot.classList.add('dot');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrapper.appendChild(dot);
  }
}

// --- UPDATE UI ---
function updateNav() {
  const dots = document.querySelectorAll('.dot');
  dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  prevBtn.disabled = currentSlide === 0;
  nextBtn.disabled = currentSlide === TOTAL_SLIDES - 1;
}

// --- GO TO SLIDE ---
function goToSlide(index) {
  if (isAnimating || index === currentSlide) return;
  isAnimating = true;

  const prev = slides[currentSlide];
  const next = slides[index];
  const direction = index > currentSlide ? 1 : -1;

  // Exit current
  prev.classList.remove('active');
  prev.style.transform = `translateX(${-60 * direction}px)`;
  prev.style.opacity   = '0';

  // Prepare next (start off-screen)
  next.style.transition = 'none';
  next.style.transform  = `translateX(${60 * direction}px)`;
  next.style.opacity    = '0';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      next.style.transition = '';
      next.classList.add('active');
      next.style.transform  = 'translateX(0)';
      next.style.opacity    = '1';
    });
  });

  setTimeout(() => {
    prev.style.transform = '';
    prev.style.opacity   = '';
    isAnimating = false;
  }, 480);

  currentSlide = index;
  updateNav();
}

// --- CHANGE SLIDE ---
function changeSlide(dir) {
  const target = currentSlide + dir;
  if (target >= 0 && target < TOTAL_SLIDES) {
    goToSlide(target);
  }
}

// --- KEYBOARD NAVIGATION ---
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') changeSlide(1);
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   changeSlide(-1);
});

// --- NAV LINK CLICKS ---
document.querySelectorAll('[data-slide]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const idx = parseInt(link.getAttribute('data-slide'));
    goToSlide(idx);
  });
});

// --- TOUCH / SWIPE ---
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
    changeSlide(dx < 0 ? 1 : -1);
  }
}, { passive: true });

// --- INIT ---
buildDots();
updateNav();

// Ensure first slide is properly visible
slides.forEach((s, i) => {
  if (i !== 0) {
    s.style.transition = 'none';
    s.style.opacity    = '0';
    s.style.transform  = 'translateX(60px)';
  }
});

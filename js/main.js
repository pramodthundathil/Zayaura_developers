/* ==========================================================================
   ZAYAURA DEVELOPERS — Architecture & Interior Design
   Main Application & Antigravity Interactive Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  init3DTilt();
  initScrollAnimations();
  initCounters();
  initPortfolioFilters();
  initDualStateSlider();
  initQuickViewModal();
  initContactFormValidation();
});

/* --------------------------------------------------------------------------
   1. Theme Management (Light / Dark Mode)
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggleButtons = document.querySelectorAll('.theme-toggle-btn');
  const savedTheme = localStorage.getItem('zayaura_theme') || 'light';

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme);

  themeToggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('zayaura_theme', newTheme);
      updateThemeIcons(newTheme);
    });
  });
}

function updateThemeIcons(theme) {
  const themeToggleButtons = document.querySelectorAll('.theme-toggle-btn');
  themeToggleButtons.forEach(btn => {
    const icon = btn.querySelector('i');
    if (icon) {
      if (theme === 'dark') {
        icon.className = 'bi bi-sun-fill';
        btn.setAttribute('aria-label', 'Switch to Light Mode');
      } else {
        icon.className = 'bi bi-moon-stars-fill';
        btn.setAttribute('aria-label', 'Switch to Dark Mode');
      }
    }
  });
}

/* --------------------------------------------------------------------------
   2. Sticky & Glass Navigation
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* --------------------------------------------------------------------------
   3. Spatial 3D Mouse Parallax & Tilt Effect
   -------------------------------------------------------------------------- */
function init3DTilt() {
  const tiltCards = document.querySelectorAll('.floating-card, .project-card, .service-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -6; // max 6deg
      const rotateY = ((x - centerX) / centerX) * 6;  // max 6deg

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
    });
  });
}

/* --------------------------------------------------------------------------
   4. GSAP & ScrollReveal Staggered Animations
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Fade Up Elements
    const fadeElements = document.querySelectorAll('.reveal-fade-up');
    fadeElements.forEach(el => {
      gsap.fromTo(el, 
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Staggered Grid Items
    const staggerGrids = document.querySelectorAll('.reveal-stagger-grid');
    staggerGrids.forEach(grid => {
      const items = grid.children;
      gsap.fromTo(items,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 80%'
          }
        }
      );
    });
  } else {
    // IntersectionObserver Fallback if GSAP is not loaded
    const observerOptions = { threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal-fade-up, .reveal-stagger-grid > *').forEach(el => {
      el.classList.add('reveal-item');
      observer.observe(el);
    });
  }
}

/* --------------------------------------------------------------------------
   5. Animated Statistics Counters
   -------------------------------------------------------------------------- */
function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const countTo = parseInt(target.getAttribute('data-count'), 10);
        let currentCount = 0;
        const duration = 1800; // ms
        const stepTime = Math.abs(Math.floor(duration / countTo));

        const timer = setInterval(() => {
          currentCount += 1;
          target.innerText = currentCount + '+';
          if (currentCount >= countTo) {
            target.innerText = countTo + '+';
            clearInterval(timer);
          }
        }, stepTime);

        observer.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(num => observer.observe(num));
}

/* --------------------------------------------------------------------------
   6. Portfolio Filtering
   -------------------------------------------------------------------------- */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  if (!filterBtns.length || !projectItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   7. Dual-State Interactive Before/After Slider
   -------------------------------------------------------------------------- */
function initDualStateSlider() {
  const container = document.querySelector('.dual-state-container');
  if (!container) return;

  const afterImage = container.querySelector('.dual-state-after');
  const handle = container.querySelector('.dual-slider-handle');

  if (!afterImage || !handle) return;

  let isSliding = false;

  const moveSlider = (clientX) => {
    const rect = container.getBoundingClientRect();
    let x = clientX - rect.left;

    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;

    const percentage = (x / rect.width) * 100;
    afterImage.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  };

  handle.addEventListener('mousedown', () => isSliding = true);
  window.addEventListener('mouseup', () => isSliding = false);
  window.addEventListener('mousemove', (e) => {
    if (isSliding) moveSlider(e.clientX);
  });

  // Touch Support
  handle.addEventListener('touchstart', () => isSliding = true);
  window.addEventListener('touchend', () => isSliding = false);
  window.addEventListener('touchmove', (e) => {
    if (isSliding && e.touches[0]) moveSlider(e.touches[0].clientX);
  });
}

/* --------------------------------------------------------------------------
   8. Quick View Project Modal
   -------------------------------------------------------------------------- */
function initQuickViewModal() {
  const quickViewBtns = document.querySelectorAll('.quick-view-btn');
  const modal = document.getElementById('projectQuickViewModal');
  
  if (!quickViewBtns.length || !modal) return;

  quickViewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const title = btn.getAttribute('data-title') || 'Architectural Project';
      const category = btn.getAttribute('data-category') || 'Residential Architecture';
      const location = btn.getAttribute('data-location') || 'Kochi, Kerala';
      const imageSrc = btn.getAttribute('data-image') || '';
      const desc = btn.getAttribute('data-desc') || 'A masterclass in contemporary architecture and refined interior craftsmanship.';

      modal.querySelector('.modal-title').innerText = title;
      modal.querySelector('.modal-category').innerText = category + ' • ' + location;
      modal.querySelector('.modal-img').src = imageSrc;
      modal.querySelector('.modal-desc').innerText = desc;
    });
  });
}

/* --------------------------------------------------------------------------
   9. Form Validation
   -------------------------------------------------------------------------- */
function initContactFormValidation() {
  const contactForm = document.getElementById('consultationContactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('formName');
    const phoneInput = document.getElementById('formPhone');
    const emailInput = document.getElementById('formEmail');
    const feedbackToast = document.getElementById('formFeedbackToast');

    if (!nameInput.value.trim() || !phoneInput.value.trim() || !emailInput.value.trim()) {
      showToast(feedbackToast, 'Please fill in all required fields.', 'danger');
      return;
    }

    // Simulate successful submission
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      contactForm.reset();
      showToast(feedbackToast, 'Thank you! Your consultation request has been received. Our principal architect will reach out shortly.', 'success');
    }, 1200);
  });
}

function showToast(element, message, type) {
  if (!element) return;
  element.className = `alert alert-${type} mt-3 d-block`;
  element.innerText = message;
  setTimeout(() => {
    element.className = 'alert d-none';
  }, 5000);
}

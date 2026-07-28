document.addEventListener('DOMContentLoaded', () => {

  /* ==================== Header scroll & mobile menu ==================== */
  const header = document.getElementById('siteHeader');
  const menuBtn = document.getElementById('menuBtn');
  const menuIcon = document.getElementById('menuIcon');
  const mobileMenu = document.getElementById('mobileMenu');

  const toggleMenu = () => {
    mobileMenu.classList.toggle('open');
    const isOpen = mobileMenu.classList.contains('open');
    menuIcon.classList.toggle('fa-bars', !isOpen);
    menuIcon.classList.toggle('fa-xmark', isOpen);
    document.body.classList.toggle('overflow-hidden', isOpen);
  };
  menuBtn.addEventListener('click', toggleMenu);
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => { if (mobileMenu.classList.contains('open')) toggleMenu(); });
  });

  const scrollProgress = document.getElementById('scrollProgress');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    toggleBackToTop();
    updateScrollSpy();
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    scrollProgress.style.width = pct + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ==================== Custom cursor ==================== */
  const cursorRing = document.getElementById('cursorRing');
  const canHover = window.matchMedia('(pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (canHover && !reducedMotion) {
    window.addEventListener('mousemove', (e) => {
      cursorRing.classList.add('visible');
      cursorRing.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    });
    document.querySelectorAll('a, button, .service-card, .gallery-item, input, select, textarea').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hover-active'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover-active'));
    });
  }

  /* ==================== Count-up stats ==================== */
  const countEls = document.querySelectorAll('.count-up');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1600;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  countEls.forEach(el => countObserver.observe(el));

  /* ==================== Service card tilt ==================== */
  const tiltCards = document.querySelectorAll('.service-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -10;
      const rotateY = ((x / rect.width) - 0.5) * 10;
      card.style.transform = `perspective(900px) translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ==================== Scroll reveal ==================== */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ==================== Hero slider ==================== */
  const heroSlides = document.querySelectorAll('.hero-slide');
  let heroIndex = 0;
  if (heroSlides.length > 1) {
    setInterval(() => {
      heroSlides[heroIndex].classList.remove('active');
      heroIndex = (heroIndex + 1) % heroSlides.length;
      heroSlides[heroIndex].classList.add('active');
    }, 5500);
  }

  /* ==================== Scrollspy ==================== */
  const sections = ['anasayfa', 'hakkimizda', 'hizmetler', 'neden-biz', 'referanslar', 'projeler', 'yorumlar', 'iletisim'];
  const navLinks = document.querySelectorAll('.nav-link');
  function updateScrollSpy() {
    let current = sections[0];
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 140) current = id;
    }
    navLinks.forEach(link => {
      link.classList.toggle('active-link', link.getAttribute('href') === `#${current}`);
    });
  }

  /* ==================== Gallery filter ==================== */
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  function applyFilter(filter) {
    filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === filter));
    galleryItems.forEach(item => {
      const match = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('hide', !match);
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
  });

  document.querySelectorAll('.filter-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      applyFilter(btn.dataset.filter);
      document.getElementById('projeler').scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ==================== Before / After slider ==================== */
  const baSlider = document.getElementById('baSlider');
  const baRange = document.getElementById('baRange');
  const baAfterWrap = document.getElementById('baAfterWrap');
  const baAfterImg = baAfterWrap ? baAfterWrap.querySelector('.ba-img') : null;

  function updateBaSlider(value) {
    baAfterWrap.style.width = value + '%';
    if (baSlider) baAfterImg.style.width = baSlider.offsetWidth + 'px';
  }
  if (baSlider && baRange) {
    updateBaSlider(baRange.value);
    baRange.addEventListener('input', () => updateBaSlider(baRange.value));
    window.addEventListener('resize', () => updateBaSlider(baRange.value));
  }

  /* ==================== Testimonials carousel ==================== */
  const track = document.getElementById('testimonialTrack');
  const slides = track ? track.children.length : 0;
  const dotsWrap = document.getElementById('testimonialDots');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');
  let current = 0;
  let autoplayTimer;

  for (let i = 0; i < slides; i++) {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Yorum ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  }

  function goToSlide(index) {
    current = (index + slides) % slides;
    track.style.transform = `translateX(-${current * 100}%)`;
    [...dotsWrap.children].forEach((d, i) => d.classList.toggle('active', i === current));
  }
  function startAutoplay() {
    autoplayTimer = setInterval(() => goToSlide(current + 1), 6000);
  }
  function stopAutoplay() { clearInterval(autoplayTimer); }

  if (track && slides > 0) {
    prevBtn.addEventListener('click', () => { goToSlide(current - 1); stopAutoplay(); startAutoplay(); });
    nextBtn.addEventListener('click', () => { goToSlide(current + 1); stopAutoplay(); startAutoplay(); });
    const viewport = document.getElementById('testimonialViewport');
    viewport.addEventListener('mouseenter', stopAutoplay);
    viewport.addEventListener('mouseleave', startAutoplay);
    startAutoplay();
  }

  /* ==================== Back to top ==================== */
  const backToTop = document.getElementById('backToTop');
  function toggleBackToTop() {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ==================== Contact form ==================== */
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const fields = [
      { id: 'adSoyad', check: v => v.trim().length >= 3 },
      { id: 'telefon', check: v => /^[0-9\s()+-]{10,15}$/.test(v.trim()) },
      { id: 'hizmetTuru', check: v => v.trim().length > 0 },
    ];

    fields.forEach(({ id, check }) => {
      const input = document.getElementById(id);
      const errorEl = document.querySelector(`[data-error-for="${id}"]`);
      const ok = check(input.value);
      input.classList.toggle('input-error', !ok);
      if (errorEl) errorEl.classList.toggle('show', !ok);
      if (!ok) valid = false;
    });

    if (!valid) return;

    const adSoyad = document.getElementById('adSoyad').value.trim();
    const telefon = document.getElementById('telefon').value.trim();
    const hizmet = document.getElementById('hizmetTuru').value;
    const mesaj = document.getElementById('mesaj').value.trim();

    const text = `Merhaba Armes Dekor, ücretsiz keşif talebim var.%0A%0AAd Soyad: ${encodeURIComponent(adSoyad)}%0ATelefon: ${encodeURIComponent(telefon)}%0AHizmet Türü: ${encodeURIComponent(hizmet)}%0AMesaj: ${encodeURIComponent(mesaj || '-')}`;
    const waUrl = `https://wa.me/905394242103?text=${text}`;

    window.open(waUrl, '_blank', 'noopener');
    formSuccess.classList.remove('hidden');

    form.reset();
    setTimeout(() => formSuccess.classList.add('hidden'), 6000);
  });

  /* ==================== Footer year ==================== */
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  onScroll();
});

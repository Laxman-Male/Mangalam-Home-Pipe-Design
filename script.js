/* 
   STICKY HEADER
   Appears when scrolled past the first viewport height
   Disappears when scrolled back to top
    */
(function initStickyHeader() {
  const stickyHeader = document.getElementById('sticky_header');
  const pageNavbar = document.getElementById('page_navbar');
  let lastKnownY = 0;
  let ticking = false;

  function updateStickyState() {
    const navBottom = pageNavbar.offsetTop + pageNavbar.offsetHeight;
    if (window.scrollY > navBottom) {
      stickyHeader.classList.add('visible');
    } else {
      stickyHeader.classList.remove('visible');
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    lastKnownY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(function () {
        updateStickyState();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* Close announcement bar */
  var closeInline = document.getElementById('close_announcement');
  var closeSticky = document.getElementById('close_sticky_ann');
  var annBar = document.getElementById('announcement_bar');
  var stickyAnn = document.getElementById('sticky_announcement');

  if (closeInline) {
    closeInline.addEventListener('click', function () {
      annBar.style.display = 'none';
    });
  }
  if (closeSticky) {
    closeSticky.addEventListener('click', function () {
      stickyAnn.style.display = 'none';
    });
  }
})();


/* 
   MOBILE MENU
    */
(function initMobileMenu() {
  var menu = document.getElementById('mobile_menu');
  var overlay = document.getElementById('mobile_overlay');
  var closeBtn = document.getElementById('close_mobile_menu');
  var mainBtn = document.getElementById('main_mobile_btn');
  var stickyBtn = document.getElementById('sticky_mobile_btn');

  function openMenu() {
    menu.classList.add('open');
    overlay.classList.add('active');
    menu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('open');
    overlay.classList.remove('active');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (mainBtn) mainBtn.addEventListener('click', openMenu);
  if (stickyBtn) stickyBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);

  /* Close on nav link click */
  var links = menu ? menu.querySelectorAll('a') : [];
  links.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
})();


/* 
   IMAGE CAROUSEL
    */
(function initCarousel() {
  var images = [
    'images/hero_thumb2.png',
    'images/hero_thumb2.png',
    'images/brand4.png',
    'images/brand5.png',
    'images/hero_thumb2.png',
    'images/hero_thumb2.png'
  ];

  var carouselImg = document.getElementById('carousel_img');
  var thumbBtns = document.querySelectorAll('.thumb');
  var prevBtn = document.getElementById('prev_arrow');
  var nextBtn = document.getElementById('next_arrow');
  var zoomImg = document.getElementById('zoom_img');
  var currentIndex = 0;

  function setImage(index) {
    currentIndex = (index + images.length) % images.length;
    var src = images[currentIndex];

    carouselImg.style.opacity = '0';
    carouselImg.style.transition = 'opacity 0.25s ease';

    setTimeout(function () {
      carouselImg.src = src;
      if (zoomImg) zoomImg.src = src;
      carouselImg.style.opacity = '1';
    }, 120);

    thumbBtns.forEach(function (btn, i) {
      btn.classList.toggle('active', i === currentIndex);
    });
  }

  thumbBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setImage(parseInt(btn.dataset.index, 10));
    });
  });

  if (prevBtn) prevBtn.addEventListener('click', function () { setImage(currentIndex - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { setImage(currentIndex + 1); });

  /* Keyboard navigation */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') setImage(currentIndex - 1);
    if (e.key === 'ArrowRight') setImage(currentIndex + 1);
  });
})();


/* 
   CAROUSEL ZOOM — shows magnified view on hover
   Zoom factor: display image is ~570px, zoom shows 1493px crop
    */
(function initCarouselZoom() {
  var carouselMain = document.getElementById('carousel_main');
  var zoomOverlay = document.getElementById('zoom_overlay');
  var zoomImg = document.getElementById('zoom_img');

  if (!carouselMain || !zoomOverlay || !zoomImg) return;

  /* Scale factor: zoomed image (1493px) / display size (570px) */
  var ZOOM_SCALE = 1493 / 570;
  /* Zoom box dimensions */
  var ZOOM_W = 350;
  var ZOOM_H = 350;

  function showZoom() {
    if (window.innerWidth < 1080) return; /* Disabled on smaller screens */
    zoomOverlay.style.display = 'block';
  }

  function hideZoom() {
    zoomOverlay.style.display = 'none';
  }

  function moveZoom(e) {
    if (window.innerWidth < 1080) return;

    var rect = carouselMain.getBoundingClientRect();
    /* Mouse position relative to image (0 to rect.width) */
    var mx = e.clientX - rect.left;
    var my = e.clientY - rect.top;

    /* Clamp to image bounds */
    mx = Math.max(0, Math.min(mx, rect.width));
    my = Math.max(0, Math.min(my, rect.height));

    /* Normalize mouse position as a fraction of the display size */
    var fx = mx / rect.width;
    var fy = my / rect.height;

    /* Position of zoomed image so the hovered point is centered in the 350x350 box */
    var imgW = rect.width * ZOOM_SCALE;
    var imgH = rect.height * ZOOM_SCALE;

    var ox = -(fx * imgW - ZOOM_W / 2);
    var oy = -(fy * imgH - ZOOM_H / 2);

    /* Clamp offset so image doesn't go out of zoom box bounds */
    ox = Math.min(0, Math.max(ox, -(imgW - ZOOM_W)));
    oy = Math.min(0, Math.max(oy, -(imgH - ZOOM_H)));

    /* Set zoom image size based on actual rendered carousel size */
    zoomImg.style.width = imgW + 'px';
    zoomImg.style.height = imgH + 'px';
    zoomImg.style.left = ox + 'px';
    zoomImg.style.top = oy + 'px';
    zoomImg.style.transform = 'none';
  }

  carouselMain.addEventListener('mouseenter', showZoom);
  carouselMain.addEventListener('mouseleave', hideZoom);
  carouselMain.addEventListener('mousemove', moveZoom);
})();

// faqs 
(function initFAQ() {
  var faqItems = document.querySelectorAll('.faq_item');

  faqItems.forEach(function (item) {
    var btn = item.querySelector('.faq_question');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var isActive = item.classList.contains('active');

      /* Close all */
      faqItems.forEach(function (other) {
        other.classList.remove('active');
        var otherBtn = other.querySelector('.faq_question');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      /* Toggle clicked */
      if (!isActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();


/* ============================================================
   MANUFACTURING STEPS
   ============================================================ */
(function initMfgSteps() {
  var steps = document.querySelectorAll('.mfg_step');
  var titleEl = document.getElementById('mfg_step_title');
  var descEl = document.getElementById('mfg_step_desc');
  var listEl = document.getElementById('mfg_step_list');

  var stepData = [
    {
      title: 'High-Grade Raw Material Selection',
      desc: 'PE100 grade HDPE resin is carefully selected and tested. Optimal molecular weight distribution ensures superior pipe performance and longevity.',
      items: ['PE100 grade material', 'Optimal molecular weight distribution', 'Strict material verification']
    },
    {
      title: 'Precision Extrusion Process',
      desc: 'The raw material is melted and extruded through a precision die at controlled temperatures to form the pipe profile with consistent wall thickness.',
      items: ['Controlled melt temperature', 'Precision die alignment', 'Consistent wall thickness']
    },
    {
      title: 'Controlled Cooling',
      desc: 'The extruded pipe is cooled in a series of water baths to stabilize dimensions and prevent internal stresses that could affect performance.',
      items: ['Multi-stage water bath cooling', 'Temperature-controlled process', 'Stress-free solidification']
    },
    {
      title: 'Accurate Sizing',
      desc: 'Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.',
      items: ['Vacuum sizing technology', 'Precise OD measurement', 'Wall thickness uniformity']
    },
    {
      title: 'Rigorous Quality Control',
      desc: 'Every pipe undergoes comprehensive testing including pressure tests, dimensional checks, and material verification per international standards.',
      items: ['Pressure and leak testing', 'Dimensional accuracy checks', 'ISO 4427 compliance testing']
    },
    {
      title: 'Permanent Marking',
      desc: 'Pipes are marked with manufacturer details, dimensions, pressure rating, and production date for full traceability throughout their service life.',
      items: ['Manufacturer identification', 'Pressure rating markings', 'Production date traceability']
    },
    {
      title: 'Precise Cutting',
      desc: 'Pipes are cut to specified lengths using automated cutting systems ensuring clean, square cuts that facilitate proper fusion jointing.',
      items: ['Automated cutting systems', 'Square-cut ends', 'Custom length capability']
    },
    {
      title: 'Secure Packaging',
      desc: 'Finished pipes are carefully bundled or coiled (smaller diameters) and packaged to protect against damage during transit and storage.',
      items: ['UV-protected coil packaging', 'Bundle strapping for larger sizes', 'Damage-resistant packaging']
    }
  ];

  if (!steps.length || !titleEl) return;

  steps.forEach(function (step) {
    step.addEventListener('click', function () {
      var idx = parseInt(step.dataset.step, 10);
      var data = stepData[idx];
      if (!data) return;

      steps.forEach(function (s) { s.classList.remove('active'); });
      step.classList.add('active');

      titleEl.textContent = data.title;
      descEl.textContent = data.desc;
      listEl.innerHTML = data.items.map(function (item) {
        return '<li>' + item + '</li>';
      }).join('');
    });
  });
})();

// form submission 
(function initForms() {
  var ctaForm = document.getElementById('cta_form');
  var catForm = document.getElementById('catalogue_form');

  function handleSubmit(e) {
    e.preventDefault();
    var btn = e.target.querySelector('button[type="submit"]');
    var original = btn ? btn.textContent : '';
    if (btn) {
      btn.textContent = 'Submitted!';
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = original;
        btn.disabled = false;
        e.target.reset();
      }, 2500);
    }
  }

  if (ctaForm) ctaForm.addEventListener('submit', handleSubmit);
  if (catForm) catForm.addEventListener('submit', handleSubmit);
})();


/* SMOOTH SCROLL OFFSET
   Accounts for sticky header height when navigating to sections
*/
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    var target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    var offset = 100; /* account for sticky header height */
    var top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: top, behavior: 'smooth' });
  });
});


(function initDownloadPopup() {
  var openBtn = document.getElementById('openPopupBtn');
  var popup = document.getElementById('mainDownloadDiv');
  var downloadBtn = document.getElementById('btnDownload');

  if (!openBtn || !popup) return;

  function openPopup() {
    popup.classList.add('popup_visible');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        popup.classList.add('popup_open');
      });
    });
    document.body.style.overflow = 'hidden';
  }

  function closePopup() {
    popup.classList.remove('popup_open');
    document.body.style.overflow = '';
    popup.addEventListener('transitionend', function handler(e) {
      if (e.target !== popup) return;
      popup.classList.remove('popup_visible');
      popup.removeEventListener('transitionend', handler);
    });
  }

  openBtn.addEventListener('click', function (e) {
    e.preventDefault();
    openPopup();
  });

  if (downloadBtn) {
    downloadBtn.addEventListener('click', function () {
      closePopup();
    });
  }

  popup.addEventListener('click', function (e) {
    if (e.target === popup) closePopup();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && popup.classList.contains('popup_open')) closePopup();
  });
})();

    const main = document.getElementById('carousel_main');
const zoomOverlay = document.getElementById('zoom_overlay');
const zoomImg = document.getElementById('zoom_img');

main.addEventListener('mousemove', (e) => {
    zoomOverlay.style.display = 'block';

    const rect = main.getBoundingClientRect();
    
    // get mouse position inside the box (0 to 1)
    let x = (e.clientX - rect.left) / rect.width;
    let y = (e.clientY - rect.top) / rect.height;

    // prevent the zoom from "running off" the edges
    x = Math.max(0, Math.min(1, x));
    y = Math.max(0, Math.min(1, y));

    //  Calculate the maximum distance the large image can move
    // It's the big image
    const maxX = zoomImg.offsetWidth - zoomOverlay.offsetWidth;
    const maxY = zoomImg.offsetHeight - zoomOverlay.offsetHeight;

    //  move the image
    zoomImg.style.left = `-${x * maxX}px`;
    zoomImg.style.top = `-${y * maxY}px`;
});

main.addEventListener('mouseleave', () => {
    zoomOverlay.style.display = 'none';
});
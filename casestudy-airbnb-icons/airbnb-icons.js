(function () {
  var PROJECT_ID = 'rk7q4uop';
  var DATASET = 'production';

  // ── TOC + IntersectionObserver ──
  var sections = document.querySelectorAll('.eid-section[data-section]');
  var tocLinks = document.querySelectorAll('.ai-toc-link');

  function scrollActiveTocIntoView(activeLink) {
    var toc = activeLink.closest('.eid-toc');
    if (!toc) return;
    var linkRect = activeLink.getBoundingClientRect();
    var tocRect = toc.getBoundingClientRect();
    var tocPaddingLeft = parseFloat(getComputedStyle(toc).paddingLeft) || 0;
    var offset = linkRect.left - tocRect.left + toc.scrollLeft - tocPaddingLeft;
    toc.scrollTo({ left: offset, behavior: 'smooth' });
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('data-section');
        var activeLink;
        tocLinks.forEach(function (link) {
          var isActive = link.getAttribute('data-target') === id;
          link.classList.toggle('active', isActive);
          if (isActive) activeLink = link;
        });
        if (activeLink) scrollActiveTocIntoView(activeLink);
      }
    });
  }, { rootMargin: '-15% 0px -70% 0px', threshold: 0 });

  sections.forEach(function (section) { observer.observe(section); });

  tocLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.querySelector('[data-section="' + link.getAttribute('data-target') + '"]');
      if (!target) return;
      var nav = document.querySelector('nav');
      var navHeight = nav ? nav.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - navHeight - 24;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  // ── Sanity fetch ──
  var slug = new URLSearchParams(window.location.search).get('slug');
  if (!slug) return;

  var query = [
    '*[_type == "project" && slug.current == $slug][0]{',
    '  title, subtitle, client, deliverables, date, role,',
    '  aboutTitle, challengeTitle, solutionTitle,',
    '  aboutText, challengeText, solutionText, solutionText2,',
    '  "coverImageUrl": coverImage.asset->url,',
    '  "aboutImageUrl": aboutImage.asset->url,',
    '  "challengeImageUrl": challengeImage.asset->url,',
    '  "solutionImageUrl": solutionImage.asset->url,',
    '  "resultsImageUrls": resultsImages[].asset->url',
    '}'
  ].join('');

  var url = 'https://' + PROJECT_ID + '.apicdn.sanity.io/v2021-10-21/data/query/' + DATASET
    + '?query=' + encodeURIComponent(query)
    + '&$slug=' + encodeURIComponent('"' + slug + '"');

  fetch(url)
    .then(function (res) { return res.json(); })
    .then(function (data) {
      var p = data.result;
      if (!p) return;

      setText('ai-title', p.title);
      setText('ai-client', p.client);
      setText('ai-date', p.date);
      setText('ai-role', p.role);
      setDeliverables('ai-deliverables', p.deliverables);
      setText('ai-about-title', p.aboutTitle);
      setText('ai-challenge-title', p.challengeTitle);
      setText('ai-solution-title', p.solutionTitle);
      setBodyText('ai-about', p.aboutText);
      setBodyText('ai-challenge', p.challengeText);
      setBodyText('ai-solution', p.solutionText);
      setBodyText('ai-solution-2', p.solutionText2);
      syncToc();

      setHeroImage(p.coverImageUrl);
      setSectionImage('ai-about-img', p.aboutImageUrl);
      setSectionImage('ai-challenge-img', p.challengeImageUrl);
      setSectionImage('ai-solution-img', p.solutionImageUrl);
      buildStrip(p.resultsImageUrls);
    })
    .catch(function (err) { console.error('Sanity fetch failed:', err); });

  function setText(id, value) {
    if (!value) return;
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function setDeliverables(id, items) {
    if (!items || !items.length) return;
    var ul = document.getElementById(id);
    if (!ul) return;
    ul.innerHTML = '';
    items.forEach(function (item) {
      var li = document.createElement('li');
      li.textContent = item;
      ul.appendChild(li);
    });
  }

  function setBodyText(id, text) {
    if (!text) return;
    var el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = '';
    text.split(/\n\n+/).forEach(function (para) {
      var trimmed = para.trim();
      var p = document.createElement('p');
      p.innerHTML = trimmed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      el.appendChild(p);
    });
  }

  function setHeroImage(url) {
    if (!url) return;
    var img = document.getElementById('ai-hero-img');
    if (img) img.src = url;
  }

  function setSectionImage(id, url) {
    var wrap = document.getElementById(id);
    if (!wrap) return;
    if (!url) {
      wrap.style.display = 'none';
      return;
    }
    var img = wrap.querySelector('img');
    if (img) img.src = url;
  }

  function syncToc() {
    var map = {
      about: 'ai-about-title',
      challenge: 'ai-challenge-title',
      solution: 'ai-solution-title',
      results: 'ai-results-title'
    };
    tocLinks.forEach(function (link) {
      var key = link.getAttribute('data-target');
      if (key === 'overview') return;
      var heading = document.getElementById(map[key]);
      if (heading && heading.textContent) link.textContent = heading.textContent;
    });
  }

  function buildStrip(urls) {
    var strip = document.getElementById('ai-strip');
    var bar = document.getElementById('ai-strip-bar');
    var wrap = document.getElementById('ai-strip-wrap');
    var arrowLeft = document.getElementById('ai-arrow-left');
    var arrowRight = document.getElementById('ai-arrow-right');
    if (!strip || !urls || !urls.length) return;

    strip.innerHTML = '';
    urls.forEach(function (url) {
      if (!url) return;
      var img = document.createElement('img');
      img.src = url;
      img.alt = '';
      img.className = 'ai-strip-img';
      strip.appendChild(img);
    });

    // ── Strip scroll state ──
    function updateState() {
      var max = strip.scrollWidth - strip.clientWidth;
      if (max <= 0) return;

      var trackWidth = bar.parentElement.clientWidth;
      var thumbWidth = bar.offsetWidth;
      var translate = (strip.scrollLeft / max) * (trackWidth - thumbWidth);
      bar.style.transform = 'translateX(' + translate + 'px)';

      var atStart = strip.scrollLeft <= 2;
      var atEnd = strip.scrollLeft >= max - 2;

      if (arrowLeft) arrowLeft.classList.toggle('hidden', atStart);
      if (arrowRight) arrowRight.classList.toggle('hidden', atEnd);
      if (wrap) wrap.classList.toggle('at-end', atEnd);
    }

    strip.addEventListener('scroll', updateState);
    updateState();

    var step = 480;
    if (arrowLeft) {
      arrowLeft.addEventListener('click', function () {
        strip.scrollBy({ left: -step, behavior: 'smooth' });
      });
    }
    if (arrowRight) {
      arrowRight.addEventListener('click', function () {
        strip.scrollBy({ left: step, behavior: 'smooth' });
      });
    }

    // ── Lightbox ──
    var lightbox = document.createElement('div');
    lightbox.className = 'ai-lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');

    var lbClose = document.createElement('button');
    lbClose.className = 'ai-lightbox-close';
    lbClose.setAttribute('aria-label', 'Close');
    lbClose.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
      '</svg>';

    var lbScroll = document.createElement('div');
    lbScroll.className = 'ai-lightbox-scroll';

    var lbImg = document.createElement('img');
    lbImg.className = 'ai-lightbox-img';
    lbImg.alt = '';

    var lbTrack = document.createElement('div');
    lbTrack.className = 'ai-lightbox-track';
    var lbBar = document.createElement('div');
    lbBar.className = 'ai-lightbox-bar';
    lbTrack.appendChild(lbBar);

    lbScroll.appendChild(lbImg);
    lightbox.appendChild(lbClose);
    lightbox.appendChild(lbScroll);
    lightbox.appendChild(lbTrack);
    document.body.appendChild(lightbox);

    lbScroll.addEventListener('scroll', function () {
      var max = lbScroll.scrollWidth - lbScroll.clientWidth;
      if (max <= 0) return;
      var trackWidth = lbTrack.clientWidth;
      var thumbWidth = lbBar.offsetWidth;
      lbBar.style.transform = 'translateX(' + (lbScroll.scrollLeft / max) * (trackWidth - thumbWidth) + 'px)';
    });

    function openLightbox(src) {
      lbImg.src = src;
      lbScroll.scrollLeft = 0;
      lbBar.style.transform = 'translateX(0)';
      lightbox.style.display = 'flex';
      requestAnimationFrame(function () {
        lightbox.classList.add('open');
      });
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      setTimeout(function () {
        lightbox.style.display = 'none';
        lbImg.src = '';
        document.body.style.overflow = '';
      }, 250);
    }

    lbClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target === lbScroll) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
    });

    strip.addEventListener('click', function (e) {
      var img = e.target.closest('.ai-strip-img');
      if (img) openLightbox(img.src);
    });
  }
})();

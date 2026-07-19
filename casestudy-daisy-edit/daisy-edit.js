(function () {
  var PROJECT_ID = 'rk7q4uop';
  var DATASET = 'production';

  var tocContainer = document.getElementById('da-toc');
  var sectionsContainer = document.getElementById('da-sections');

  // ── Sanity fetch ──
  var slug = new URLSearchParams(window.location.search).get('slug');
  if (!slug) return;

  var query = [
    '*[_type == "project" && slug.current == $slug][0]{',
    '  title, subtitle, client, deliverables, date, role, aboutText,',
    '  "coverImageUrl": coverImage.asset->url,',
    '  narrativeSections[]{',
    '    title, body,',
    '    "mediaUrls": media[].asset->url',
    '  }',
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

      setText('da-title', p.title);
      setText('da-subtitle', p.subtitle);
      setText('da-client', p.client);
      setText('da-date', p.date);
      setText('da-role', p.role);
      setDeliverables('da-deliverables', p.deliverables);
      setBodyText('da-intro', p.aboutText);
      setHeroImage(p.coverImageUrl);

      buildSections(p.narrativeSections);
      setupToc();
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
    appendBodyText(el, text);
  }

  function appendBodyText(el, text) {
    el.innerHTML = '';
    text.split(/\n\n+/).forEach(function (para) {
      var trimmed = para.trim();
      if (!trimmed) return;
      var pEl = document.createElement('p');
      pEl.innerHTML = trimmed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      el.appendChild(pEl);
    });
  }

  function setHeroImage(imgUrl) {
    if (!imgUrl) return;
    var img = document.getElementById('da-hero-img');
    if (img) img.src = imgUrl;
  }

  function buildSections(sections) {
    if (!sections || !sections.length || !sectionsContainer) return;

    sections.forEach(function (section, index) {
      var sectionId = 'section-' + index;

      var sectionEl = document.createElement('section');
      sectionEl.className = 'eid-section';
      sectionEl.setAttribute('data-section', sectionId);

      if (section.title) {
        var heading = document.createElement('h2');
        heading.className = 'eid-section-title';
        heading.textContent = section.title;
        sectionEl.appendChild(heading);
      }

      if (section.body) {
        var bodyEl = document.createElement('div');
        bodyEl.className = 'eid-body';
        appendBodyText(bodyEl, section.body);
        sectionEl.appendChild(bodyEl);
      }

      var mediaUrls = (section.mediaUrls || []).filter(Boolean);
      if (mediaUrls.length === 1) {
        sectionEl.appendChild(buildSingleImage(mediaUrls[0]));
      } else if (mediaUrls.length > 1) {
        sectionEl.appendChild(buildCarousel(mediaUrls));
      }

      sectionsContainer.appendChild(sectionEl);
    });
  }

  function buildSingleImage(imgUrl) {
    var wrap = document.createElement('div');
    wrap.className = 'da-media-single';
    var img = document.createElement('img');
    img.src = imgUrl;
    img.alt = '';
    wrap.appendChild(img);
    return wrap;
  }

  function buildCarousel(urls) {
    var current = 0;

    var carousel = document.createElement('div');
    carousel.className = 'da-carousel';

    var viewport = document.createElement('div');
    viewport.className = 'da-carousel-viewport';
    var track = document.createElement('div');
    track.className = 'da-carousel-track';
    urls.forEach(function (imgUrl) {
      var img = document.createElement('img');
      img.src = imgUrl;
      img.alt = '';
      track.appendChild(img);
    });
    viewport.appendChild(track);

    var arrowLeft = buildCarouselArrow('left', 'Previous image', 'M12.5 15L7.5 10L12.5 5');
    var arrowRight = buildCarouselArrow('right', 'Next image', 'M7.5 5L12.5 10L7.5 15');

    var dotsWrap = document.createElement('div');
    dotsWrap.className = 'da-carousel-dots';
    var dots = urls.map(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'da-carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to image ' + (i + 1));
      dot.addEventListener('click', function () { goTo(i); });
      dotsWrap.appendChild(dot);
      return dot;
    });

    function goTo(index) {
      current = (index + urls.length) % urls.length;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    arrowLeft.addEventListener('click', function () { goTo(current - 1); });
    arrowRight.addEventListener('click', function () { goTo(current + 1); });

    var row = document.createElement('div');
    row.className = 'da-carousel-row';
    row.appendChild(arrowLeft);
    row.appendChild(viewport);
    row.appendChild(arrowRight);

    carousel.appendChild(row);
    carousel.appendChild(dotsWrap);

    return carousel;
  }

  function buildCarouselArrow(direction, label, pathD) {
    var button = document.createElement('button');
    button.className = 'da-carousel-arrow da-carousel-arrow--' + direction;
    button.setAttribute('aria-label', label);
    button.innerHTML =
      '<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="' + pathD + '" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>';
    return button;
  }

  function setupToc() {
    var sections = document.querySelectorAll('.eid-section[data-section]');
    if (!sections.length || !tocContainer) return;

    sections.forEach(function (section) {
      var id = section.getAttribute('data-section');
      if (id === 'overview') return;

      var heading = section.querySelector('.eid-section-title');
      var link = document.createElement('a');
      link.className = 'ai-toc-link';
      link.setAttribute('data-target', id);
      link.textContent = heading ? heading.textContent : id;
      tocContainer.appendChild(link);
    });

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
  }
})();

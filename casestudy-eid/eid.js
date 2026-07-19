(function () {
  var PROJECT_ID = 'rk7q4uop';
  var DATASET = 'production';

  // ── TOC + IntersectionObserver ──
  var sections = document.querySelectorAll('.eid-section[data-section]');
  var tocLinks = document.querySelectorAll('.eid-toc-link');

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
    '  "accordionItems": accordionItems[]{ title, body, "imageUrl": image.asset->url }',
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

      setText('eid-title', p.title);
      setText('eid-client', p.client);
      setText('eid-date', p.date);
      setText('eid-role', p.role);
      setDeliverables('eid-deliverables', p.deliverables);
      setText('eid-about-title', p.aboutTitle);
      setText('eid-challenge-title', p.challengeTitle);
      setText('eid-solution-title', p.solutionTitle);
      setBodyText('eid-about', p.aboutText);
      setBodyText('eid-challenge', p.challengeText);
      setBodyText('eid-solution', p.solutionText);
      setBodyText('eid-solution-2', p.solutionText2);
      syncToc();

      setHeroImage(p.coverImageUrl);
      setSectionImage('eid-about-img', p.aboutImageUrl);
      setSectionImage('eid-challenge-img', p.challengeImageUrl);
      setSectionImage('eid-solution-img', p.solutionImageUrl);
      buildAccordion(p.accordionItems);
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
    var img = document.getElementById('eid-hero-img');
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
    var map = { about: 'eid-about-title', challenge: 'eid-challenge-title', solution: 'eid-solution-title' };
    tocLinks.forEach(function (link) {
      var heading = document.getElementById(map[link.getAttribute('data-target')]);
      if (heading && heading.textContent) link.textContent = heading.textContent;
    });
  }

  function buildAccordion(items) {
    var container = document.getElementById('eid-accordion');
    if (!container || !items || !items.length) return;
    container.innerHTML = '';
    items.forEach(function (item) {
      var div = document.createElement('div');
      div.className = 'accordion-item';

      var imageHtml = item.imageUrl
        ? '<div class="eid-section-image"><img src="' + item.imageUrl + '" alt="" /></div>'
        : '';

      div.innerHTML =
        '<button class="accordion-trigger">' +
          item.title +
          '<svg class="accordion-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<path d="M5 7.5L10 12.5L15 7.5" stroke="#222" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
          '</svg>' +
        '</button>' +
        '<div class="accordion-body">' +
          '<p>' + item.body.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') + '</p>' +
          imageHtml +
        '</div>';

      div.querySelector('.accordion-trigger').addEventListener('click', function () {
        div.classList.toggle('open');
      });

      container.appendChild(div);
    });
  }
})();

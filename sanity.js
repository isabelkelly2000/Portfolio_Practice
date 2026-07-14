(function () {
  var PROJECT_ID = 'rk7q4uop';
  var DATASET = 'production';
  var query = '*[_type == "project"] | order(order asc) {title, "slug": slug.current, company, role, description, deliverables, "coverImageUrl": coverImage.asset->url, tags, template}';
  var url = 'https://' + PROJECT_ID + '.apicdn.sanity.io/v2021-10-21/data/query/' + DATASET + '?query=' + encodeURIComponent(query);

  var grid = document.querySelector('.projects-grid');
  if (!grid) return;

  fetch(url)
    .then(function (res) { return res.json(); })
    .then(function (data) {
      var projects = data.result;
      if (!projects || projects.length === 0) {
        grid.innerHTML = '';
        return;
      }
      grid.innerHTML = '';
      projects.forEach(function (project) {
        grid.appendChild(createCard(project));
      });
      initStackScroll();
      updateOverlapShadows();
      window.addEventListener('resize', function () { initStackScroll(); updateOverlapShadows(); });
      window.addEventListener('scroll', function () { handleHeaderRelease(); updateOverlapShadows(); }, { passive: true });
    })
    .catch(function (err) {
      console.error('Sanity fetch failed:', err);
    });

  function createCard(project) {
    var template = project.template || 'casestudy.html';
    var href = project.slug ? template + '?slug=' + encodeURIComponent(project.slug) : null;

    var wrapper = href ? document.createElement('a') : document.createElement('div');
    if (href) {
      wrapper.href = href;
      wrapper.style.cssText = 'text-decoration:none;color:inherit;display:block;';
    }

    var article = document.createElement('article');
    article.className = 'project-card';

    // Left: text info
    var infoDiv = document.createElement('div');
    infoDiv.className = 'project-info';

    var title = document.createElement('h3');
    title.className = 'project-title';
    title.textContent = project.title || '';

    var metaDiv = document.createElement('div');
    metaDiv.className = 'project-meta';

    var company = document.createElement('span');
    company.className = 'project-company';
    company.textContent = project.company || '';

    var dot = document.createElement('span');
    dot.className = 'meta-dot';

    var roleTag = document.createElement('span');
    roleTag.className = 'project-role-tag';
    roleTag.textContent = project.role || '';

    metaDiv.appendChild(company);
    metaDiv.appendChild(dot);
    metaDiv.appendChild(roleTag);

    var pillsDiv = document.createElement('div');
    pillsDiv.className = 'project-pills';

    if (Array.isArray(project.tags)) {
      project.tags.forEach(function (item) {
        var pill = document.createElement('span');
        pill.className = 'project-pill';
        pill.textContent = item;
        pillsDiv.appendChild(pill);
      });
    }

    infoDiv.appendChild(title);
    infoDiv.appendChild(metaDiv);
    infoDiv.appendChild(pillsDiv);

    // Right: image
    var imageDiv = document.createElement('div');
    imageDiv.className = 'project-image';

    if (project.coverImageUrl) {
      var img = document.createElement('img');
      img.src = project.coverImageUrl;
      img.alt = project.title || '';
      imageDiv.appendChild(img);
    } else {
      ['long', 'medium', 'short'].forEach(function (size) {
        var line = document.createElement('div');
        line.className = 'img-line ' + size;
        imageDiv.appendChild(line);
      });
    }

    article.appendChild(infoDiv);
    article.appendChild(imageDiv);
    wrapper.appendChild(article);

    return wrapper;
  }

  var currentStickyTop = 0;

  function initStackScroll() {
    var cards = document.querySelectorAll('.projects-grid > *');
    var nav = document.querySelector('nav');
    var workHeader = document.querySelector('.work-header');
    var navHeight = nav ? nav.offsetHeight : 0;
    var headerHeight = workHeader ? workHeader.offsetHeight : 0;
    if (workHeader) {
      workHeader.style.top = navHeight + 'px';
      workHeader.style.transform = '';
    }
    currentStickyTop = navHeight + headerHeight;
    cards.forEach(function (card, i) {
      card.style.position = 'sticky';
      card.style.top = currentStickyTop + 'px';
      card.style.zIndex = i + 1;
      card.style.marginBottom = '';
      card.style.scrollSnapAlign = 'start';
      card.style.scrollMarginTop = currentStickyTop + 'px';
    });
  }

  function updateOverlapShadows() {
    var cards = document.querySelectorAll('.projects-grid > *');
    cards.forEach(function (card, i) {
      if (i === 0) { card.classList.remove('card-overlapping'); return; }
      var top = card.getBoundingClientRect().top;
      card.classList.toggle('card-overlapping', top <= currentStickyTop + 1);
    });
  }

  function handleHeaderRelease() {
    var workHeader = document.querySelector('.work-header');
    var cards = document.querySelectorAll('.projects-grid > *');
    if (!workHeader || !cards.length) return;
    var lastCard = cards[cards.length - 1];
    var lastCardTop = lastCard.getBoundingClientRect().top;
    // While the last card is sticky, lastCardTop === currentStickyTop (no transform needed).
    // Once it releases and scrolls up, lastCardTop drops below currentStickyTop —
    // translate the header up by the same amount so both scroll off together.
    var overshoot = currentStickyTop - lastCardTop;
    if (overshoot > 0) {
      workHeader.style.transform = 'translateY(-' + overshoot + 'px)';
    } else {
      workHeader.style.transform = '';
    }
  }

  var lastUpSnapTime = 0;

  function getCardSnapPositions() {
    var cards = document.querySelectorAll('.projects-grid > *');
    var positions = [];
    cards.forEach(function (card) {
      positions.push(Math.round(card.offsetTop - currentStickyTop));
    });
    return positions;
  }

  window.addEventListener('wheel', function (e) {
    if (e.deltaY >= 0) return;
    var positions = getCardSnapPositions();
    if (!positions.length) return;
    var scrollY = window.scrollY;
    if (scrollY < positions[0] - 50 || scrollY > positions[positions.length - 1] + 50) return;
    var prevPos = null;
    for (var i = positions.length - 1; i >= 0; i--) {
      if (positions[i] < scrollY - 20) { prevPos = positions[i]; break; }
    }
    if (prevPos === null) return;
    if (Date.now() - lastUpSnapTime < 400) { e.preventDefault(); return; }
    e.preventDefault();
    lastUpSnapTime = Date.now();
    document.documentElement.style.scrollSnapType = 'none';
    window.scrollTo({ top: prevPos, behavior: 'smooth' });
    setTimeout(function () { document.documentElement.style.scrollSnapType = ''; }, 500);
  }, { passive: false });

})();

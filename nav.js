(function () {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.addEventListener('pageshow', function () {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  });

  var isRoot = window.location.pathname === '/' || /\/index\.html$/.test(window.location.pathname);
  var workHref    = isRoot ? '#work'    : 'index.html#work';
  var contactHref = isRoot ? '#contact' : 'index.html#contact';

  var navHTML =
    '<nav>' +
      '<a href="index.html" class="nav-logo">' +
        '<img class="logo-desktop" src="assets/Name_Lockup_DarkBlue.png" alt="Izzy Kelly" />' +
        '<img class="logo-mobile" src="assets/IK_Icon_DarkBlue.png" alt="IK" />' +
      '</a>' +
      '<button class="hamburger" aria-label="Toggle menu" aria-expanded="false">' +
        '<span></span><span></span><span></span>' +
      '</button>' +
      '<ul class="nav-links">' +
        '<li><a href="' + workHref + '">WORK</a></li>' +
        '<li><a href="about/">ABOUT</a></li>' +
        '<li>' +
          '<a href="' + contactHref + '" class="contact-link">' +
            '<img class="contact-img contact-img-default" src="assets/contact-me.png" alt="Contact Me" />' +
            '<img class="contact-img contact-img-hover" src="assets/contact-me-hover.png" alt="Contact Me" />' +
          '</a>' +
        '</li>' +
      '</ul>' +
    '</nav>';

  var placeholder = document.getElementById('site-nav');
  if (placeholder) placeholder.outerHTML = navHTML;

  var nav   = document.querySelector('nav');
  var btn   = document.querySelector('.hamburger');
  var links = document.querySelector('.nav-links');

  var contactLink = document.querySelector('.contact-link');
  if (contactLink) {
    var PROJECT_ID = 'rk7q4uop';
    var DATASET = 'production';
    var query = '*[_type == "about"][0]{ linkedinUrl }';
    var aboutUrl = 'https://' + PROJECT_ID + '.apicdn.sanity.io/v2021-10-21/data/query/' + DATASET
      + '?query=' + encodeURIComponent(query);

    fetch(aboutUrl)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var linkedinUrl = data.result && data.result.linkedinUrl;
        if (!linkedinUrl) return;
        contactLink.href = linkedinUrl;
        contactLink.target = '_blank';
        contactLink.rel = 'noopener noreferrer';
      })
      .catch(function (err) { console.error('LinkedIn link fetch failed:', err); });
  }

  if (!btn) return;

  btn.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    nav.classList.toggle('nav-open', open);
    btn.setAttribute('aria-expanded', open);
  });

  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      links.classList.remove('open');
      nav.classList.remove('nav-open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
})();

(function () {
  var versions = [
    {
      label: 'V1',
      title: 'Direction from E-team',
      html: '<ul class="carousel-text-list">' +
        '<li>Straw man sketch of a board detailing attendees to a launch event</li>' +
        '<li>Sections of CELEBS, PRESS, &amp; INFLUENCERS</li>' +
        '<li>Small bubbles with Influencer Name/Photo and Press Logos</li>' +
        '</ul>'
    },
    {
      label: 'V2',
      title: 'Initial Sketch / Trial Layout',
      html: '<ul class="carousel-text-list">' +
        '<li>A Press, Influencer, and Celebrity section each with:' +
          '<ul>' +
            '<li>Net NEW attendees and returning attendees &mdash; how many attendees for previous launch (N8) vs. upcoming launch (M1)</li>' +
            '<li>Details about attendees (Press = outlet logo, Celeb/Influencer = photo/follower count)</li>' +
          '</ul>' +
        '</li>' +
        '</ul>'
    },
    {
      label: 'V3',
      title: 'Tweaks and Changes',
      html: '<ul class="carousel-text-list">' +
        '<li>Remove yellow &ldquo;new&rdquo; icon from items, bucket underneath a &ldquo;new&rdquo; subhead</li>' +
        '<li>Remove N8/M1 attendee count from the header and detail in the list, change to bucketed subheads</li>' +
        '</ul>'
    },
    {
      label: 'V4',
      title: 'Final',
      html: '<div class="carousel-text-final">Shrink press logos.</div>' +
        '<div class="carousel-text-check">Send to print &#9989;</div>'
    }
  ];

  var frameOverview = document.getElementById('frameOverview');
  var frameDetail = document.getElementById('frameDetail');
  var imageMain = document.getElementById('imageMain');
  var imageSecondary = document.getElementById('imageSecondary');
  var textBox = document.getElementById('carouselText');
  var textLabel = document.getElementById('textLabel');
  var textTitle = document.getElementById('textTitle');
  var textContent = document.getElementById('textContent');
  var prevArrow = document.getElementById('prevArrow');
  var nextArrow = document.getElementById('nextArrow');
  var dotsWrap = document.getElementById('carouselDots');
  var stage = document.querySelector('.carousel-stage');

  // frame 0 = overview, frames 1..versions.length = detail slides
  var frame = 0;
  var animating = false;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  versions.forEach(function (v, i) {
    var dot = document.createElement('div');
    dot.className = 'carousel-dot';
    dotsWrap.appendChild(dot);
  });

  function updateDots() {
    Array.prototype.forEach.call(dotsWrap.children, function (dot, i) {
      dot.classList.toggle('active', frame > 0 && i === frame - 1);
    });
  }

  function updateArrows() {
    prevArrow.disabled = frame === 0;
    nextArrow.disabled = frame === versions.length;
  }

  function setText(versionIndex) {
    var v = versions[versionIndex];
    textLabel.textContent = v.label;
    textTitle.textContent = v.title;
    textContent.innerHTML = v.html;
  }

  function swapText(versionIndex, cb) {
    if (reducedMotion) {
      setText(versionIndex);
      if (cb) cb();
      return;
    }
    textBox.classList.add('swapping');
    window.setTimeout(function () {
      setText(versionIndex);
      textBox.classList.remove('swapping');
      if (cb) cb();
    }, 200);
  }

  // Animate el from fromRect to toRect via transform (FLIP).
  function flip(el, fromRect, toRect, done) {
    if (reducedMotion) {
      el.style.transform = 'none';
      if (done) done();
      return;
    }
    var dx = fromRect.left - toRect.left;
    var dy = fromRect.top - toRect.top;
    var sx = fromRect.width / toRect.width;
    var sy = fromRect.height / toRect.height;

    el.style.transition = 'none';
    el.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + sx + ',' + sy + ')';
    el.getBoundingClientRect();
    el.style.transition = '';
    requestAnimationFrame(function () {
      el.style.transform = 'none';
    });

    var onEnd = function (e) {
      if (e && e.target !== el) return;
      el.removeEventListener('transitionend', onEnd);
      if (done) done();
    };
    el.addEventListener('transitionend', onEnd);
  }

  function growIn(el, done) {
    if (reducedMotion) {
      el.classList.remove('is-empty');
      el.style.transform = 'none';
      if (done) done();
      return;
    }
    el.classList.remove('is-empty');
    el.style.transition = 'none';
    el.style.transform = 'scale(0.001)';
    el.getBoundingClientRect();
    el.style.transition = '';
    requestAnimationFrame(function () {
      el.style.transform = 'none';
    });
    var onEnd = function (e) {
      if (e && e.target !== el) return;
      el.removeEventListener('transitionend', onEnd);
      if (done) done();
    };
    el.addEventListener('transitionend', onEnd);
  }

  // Animate el (currently resting at homeRect, transform: none) OUT to an
  // explicit targetRect that is not el's own natural position — the mirror
  // image of flip(), which only ever animates an element back to its own
  // natural resting spot.
  function flipOut(el, homeRect, targetRect, done) {
    if (reducedMotion) {
      if (done) done();
      return;
    }
    var dx = targetRect.left - homeRect.left;
    var dy = targetRect.top - homeRect.top;
    var sx = targetRect.width / homeRect.width;
    var sy = targetRect.height / homeRect.height;
    requestAnimationFrame(function () {
      el.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + sx + ',' + sy + ')';
    });
    var onEnd = function (e) {
      if (e && e.target !== el) return;
      el.removeEventListener('transitionend', onEnd);
      if (done) done();
    };
    el.addEventListener('transitionend', onEnd);
  }

  function setMainContent(versionIndex) {
    imageMain.dataset.version = versionIndex;
  }

  function setSecondaryContent(versionIndex) {
    imageSecondary.dataset.version = versionIndex;
  }

  // ── Frame 0 -> Frame 1: thumbnail grows into main slot ──
  function enterDetailFromOverview() {
    animating = true;
    var thumb = frameOverview.querySelector('.overview-thumb[data-thumb="0"]');
    var thumbRect = thumb.getBoundingClientRect();

    frameOverview.classList.add('hidden');
    frameDetail.classList.add('active');
    setMainContent(0);
    imageMain.classList.remove('is-empty');
    setText(0);
    frame = 1;
    updateDots();
    updateArrows();

    var mainRect = imageMain.parentElement.getBoundingClientRect();
    flip(imageMain, thumbRect, mainRect, function () {
      animating = false;
    });
  }

  // ── Frame 1 -> Frame 0: main shrinks back into overview thumbnail ──
  function exitDetailToOverview() {
    animating = true;
    var thumb = frameOverview.querySelector('.overview-thumb[data-thumb="0"]');
    frameOverview.classList.remove('hidden');
    var thumbRect = thumb.getBoundingClientRect();
    var mainRect = imageMain.getBoundingClientRect();

    textBox.classList.add('swapping');

    flipOut(imageMain, mainRect, thumbRect, function () {
      frameDetail.classList.remove('active');
      imageMain.classList.add('is-empty');
      imageMain.style.transform = 'none';
      frame = 0;
      updateDots();
      updateArrows();
      animating = false;
    });
  }

  // ── Advance from detail frame k -> k+1 ──
  // The outgoing image (main -> secondary) and the incoming image (grow from
  // center into main) are two separate elements animating in parallel — the
  // incoming image does exactly one motion: scale up from its own center.
  function advanceDetail() {
    animating = true;
    var nextVersion = frame; // frame is 1-indexed slide; versions[] is 0-indexed

    var mainRect = imageMain.getBoundingClientRect();
    var secondaryRect = imageSecondary.getBoundingClientRect();

    swapText(nextVersion);

    var pending = 2;
    function stepDone() {
      pending -= 1;
      if (pending === 0) {
        frame += 1;
        updateDots();
        updateArrows();
        animating = false;
      }
    }

    // outgoing main -> secondary slot (its own element, runs independently)
    var outgoingVersion = imageMain.dataset.version;
    setSecondaryContent(outgoingVersion);
    imageSecondary.classList.remove('is-empty');
    imageSecondary.style.transform = 'none';
    flip(imageSecondary, mainRect, secondaryRect, stepDone);

    // incoming image: swap content instantly, then grow from its own center
    setMainContent(nextVersion);
    imageMain.classList.add('is-empty');
    growIn(imageMain, stepDone);
  }

  // ── Retreat from detail frame k -> k-1 (k >= 2) ──
  // Exact mirror of advanceDetail: imageMain (native home = main slot) slides
  // in from the secondary slot's position; imageSecondary (native home =
  // secondary slot) hides instantly and, if there's an older predecessor,
  // grows back in with that content — the same "swap the visible element"
  // trick advanceDetail uses, just reversed.
  function retreatDetail() {
    animating = true;
    var targetVersion = frame - 2; // version the main slot lands on
    var newSecondaryVersion = targetVersion - 1; // may be -1 (none)

    var mainRect = imageMain.getBoundingClientRect();
    var secondaryRect = imageSecondary.getBoundingClientRect();

    swapText(targetVersion);

    var pending = newSecondaryVersion >= 0 ? 2 : 1;
    function stepDone() {
      pending -= 1;
      if (pending === 0) {
        frame -= 1;
        updateDots();
        updateArrows();
        animating = false;
      }
    }

    // arriving main: swap content instantly, then slide+grow in from the
    // secondary slot's position/size up to the main slot (its native home)
    setMainContent(targetVersion);
    flip(imageMain, secondaryRect, mainRect, stepDone);

    // old secondary content is now the main image — hide this element
    // instantly, then (if there's an older predecessor) grow it back in
    imageSecondary.classList.add('is-empty');
    if (newSecondaryVersion >= 0) {
      setSecondaryContent(newSecondaryVersion);
      growIn(imageSecondary, stepDone);
    } else {
      imageSecondary.style.transform = 'none';
    }
  }

  function next() {
    if (animating) return;
    if (frame === versions.length) return;
    if (frame === 0) {
      enterDetailFromOverview();
    } else {
      advanceDetail();
    }
  }

  function prev() {
    if (animating) return;
    if (frame === 0) return;
    if (frame === 1) {
      exitDetailToOverview();
    } else {
      retreatDetail();
    }
  }

  nextArrow.addEventListener('click', next);
  prevArrow.addEventListener('click', prev);

  updateDots();
  updateArrows();
})();

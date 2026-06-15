(function () {
  var text = 'IZZY KELLY';
  var delay = 120;
  var el = document.getElementById('loader-text');
  var cursor = document.getElementById('loader-cursor');
  var loader = document.getElementById('loader');
  var i = 0;

  function typeNext() {
    if (i < text.length) {
      el.textContent += text[i];
      i++;
      setTimeout(typeNext, delay);
    } else {
      setTimeout(finish, 600);
    }
  }

  function finish() {
    cursor.classList.add('hidden');
    loader.classList.add('fade-out');
    loader.addEventListener('transitionend', function () {
      loader.style.display = 'none';
      document.documentElement.style.overflow = '';
    }, { once: true });
  }

  typeNext();
})();

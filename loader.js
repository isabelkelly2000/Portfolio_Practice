(function () {
  var loader = document.getElementById('loader');
  var el = document.getElementById('loader-text');
  var cursor = document.getElementById('loader-cursor');

  function skip() {
    loader.style.display = 'none';
    document.documentElement.style.overflow = '';
  }

  if (sessionStorage.getItem('loaderSeen')) {
    skip();
    return;
  }

  var text = 'IZZY KELLY';
  var delay = 200;
  var i = 0;

  function typeNext() {
    if (i < text.length) {
      el.textContent += text[i];
      i++;
      setTimeout(typeNext, delay);
    } else {
      setTimeout(finish, 1000);
    }
  }

  function finish() {
    sessionStorage.setItem('loaderSeen', '1');
    cursor.classList.add('hidden');
    loader.classList.add('fade-out');
    loader.addEventListener('transitionend', function () {
      loader.style.display = 'none';
      document.documentElement.style.overflow = '';
    }, { once: true });
  }

  setTimeout(typeNext, 1000);
})();

(function () {
  var char = document.getElementById('character');
  if (!char) return;

  var posX = -60;
  var speed = .8;
  var paused = false;

  function animate() {
    if (!paused) {
      posX += speed;
      char.style.left = posX + 'px';

      if (posX > window.innerWidth) {
        char.style.display = 'none';
        return;
      }
    }
    requestAnimationFrame(animate);
  }

  setTimeout(function () {
    requestAnimationFrame(animate);
  }, 8000);

  char.addEventListener('click', function () {
    if (paused) return;

    var reactions = [
      'assets/Dr._Booger-_Sleepin-transparent.gif',
      'assets/Dr._BOOGER_waving.gif'
    ];
    paused = true;
    char.src = reactions[Math.floor(Math.random() * reactions.length)];

    setTimeout(function () {
      paused = false;
      char.src = 'assets/Dr._Booger_-_Walking-transparent.gif';
    }, 3000);
  });
})();

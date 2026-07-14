(function () {
  var char = document.getElementById('character');
  if (!char) return;

  var visits = parseInt(localStorage.getItem('booger-visits') || '0', 10) + 1;
  localStorage.setItem('booger-visits', visits);

  if (visits % 3 !== 1) {
    char.style.display = 'none';
    return;
  }

  var tooltip = document.createElement('div');
  tooltip.id = 'character-tooltip';
  tooltip.textContent = 'click me!';
  document.body.appendChild(tooltip);

  char.addEventListener('mouseenter', function () {
    if (!paused) tooltip.style.opacity = '1';
  });
  char.addEventListener('mouseleave', function () {
    tooltip.style.opacity = '0';
  });

  var posX = -60;
  var speed = .8;
  var paused = false;

  function animate() {
    if (!paused) {
      posX += speed;
      char.style.left = posX + 'px';
      tooltip.style.left = (posX + 100) + 'px';

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
    tooltip.style.opacity = '0';

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

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
  }, 5000);

  char.addEventListener('click', function () {
    if (paused) return;

    paused = true;
    char.src = 'DrBooger_SleepingCrop.gif';

    setTimeout(function () {
      paused = false;
      char.src = 'DrBooger_WalkingCrop.gif';
    }, 3000);
  });
})();

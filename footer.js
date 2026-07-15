(function () {
  var isRoot = window.location.pathname === '/' || /\/index\.html$/.test(window.location.pathname);
  var homeHref = isRoot ? '#home'    : 'index.html';
  var workHref = isRoot ? '#work'    : 'index.html#work';

  var footerHTML =
    '<footer id="contact">' +
      '<div class="footer-top">' +
        '<div class="footer-left">' +
          '<p class="footer-name"><img src="assets/Name_Lockup_DarkBlue.png" alt="Izzy Kelly" /></p>' +
        '</div>' +
        '<div class="footer-right">' +
          '<div class="footer-col">' +
            '<h4>NAVIGATE</h4>' +
            '<ul>' +
              '<li><a href="' + homeHref + '">Home</a></li>' +
              '<li><a href="' + workHref + '">Work</a></li>' +
              '<li><a href="about/">About</a></li>' +
            '</ul>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4>CONNECT</h4>' +
            '<ul>' +
              '<li><a href="https://linkedin.com/in/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>' +
              '<li><a href="#">Instagram</a></li>' +
              '<li><a href="#">Resume</a></li>' +
            '</ul>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4>SAY HELLO</h4>' +
            '<ul>' +
              '<li><a href="mailto:isabel.kelly2000@gmail.com">Email</a></li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="footer-bottom">' +
        '<img src="assets/IK_Icon_DarkBlue.png" alt="IK" class="footer-icon" />' +
        '<p>&copy; 2026 Izzy Kelly. Designed &amp; built by me.</p>' +
      '</div>' +
    '</footer>';

  var placeholder = document.getElementById('site-footer');
  if (placeholder) placeholder.outerHTML = footerHTML;
})();

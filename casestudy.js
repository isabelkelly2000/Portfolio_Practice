(function () {
  var PROJECT_ID = 'rk7q4uop';
  var DATASET = 'production';

  var slug = new URLSearchParams(window.location.search).get('slug');
  if (!slug) return;

  var query = '*[_type == "project" && slug.current == $slug][0]{title, subtitle, client, deliverables, date, role, aboutText, challengeText, solutionText}';
  var url = 'https://' + PROJECT_ID + '.apicdn.sanity.io/v2021-10-21/data/query/' + DATASET
    + '?query=' + encodeURIComponent(query)
    + '&$slug=' + encodeURIComponent('"' + slug + '"');

  fetch(url)
    .then(function (res) { return res.json(); })
    .then(function (data) {
      var p = data.result;
      if (!p) return;

      setText('cs-title', p.title);
      setText('cs-subtitle', p.subtitle);
      setText('cs-client', p.client);
      setText('cs-date', p.date);
      setText('cs-role', p.role);
      setDeliverables('cs-deliverables', p.deliverables);
      setBodyText('cs-about', p.aboutText);
      setBodyText('cs-challenge', p.challengeText);
      setBodyText('cs-solution', p.solutionText);
    })
    .catch(function (err) {
      console.error('Sanity fetch failed:', err);
    });

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
    var paragraphs = text.split(/\n\n+/);
    el.innerHTML = '';
    paragraphs.forEach(function (para) {
      var p = document.createElement('p');
      p.textContent = para.trim();
      el.appendChild(p);
    });
  }
})();

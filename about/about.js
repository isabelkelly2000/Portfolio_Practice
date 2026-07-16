(function () {
  var PROJECT_ID = 'rk7q4uop';
  var DATASET = 'production';

  var query = '*[_type == "about"][0]{ bio, spotifyUrl, linkedinUrl, instagramUrl }';

  var url = 'https://' + PROJECT_ID + '.apicdn.sanity.io/v2021-10-21/data/query/' + DATASET
    + '?query=' + encodeURIComponent(query);

  fetch(url)
    .then(function (res) { return res.json(); })
    .then(function (data) {
      var a = data.result;
      if (!a) return;

      var bio = document.getElementById('about-bio');
      if (bio && a.bio) bio.textContent = a.bio;

      setLink('about-spotify', a.spotifyUrl);
      setLink('about-linkedin', a.linkedinUrl);
      setLink('about-instagram', a.instagramUrl);
    })
    .catch(function (err) { console.error('About fetch failed:', err); });

  function setLink(id, url) {
    if (!url) return;
    var el = document.getElementById(id);
    if (el) el.href = url;
  }
})();

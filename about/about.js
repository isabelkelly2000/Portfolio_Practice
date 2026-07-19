(function () {
  var PROJECT_ID = 'rk7q4uop';
  var DATASET = 'production';

  var query = '*[_type == "about"][0]{ bio, spotifyUrl, instagramWidgetUrl }';

  var url = 'https://' + PROJECT_ID + '.apicdn.sanity.io/v2021-10-21/data/query/' + DATASET
    + '?query=' + encodeURIComponent(query);

  fetch(url)
    .then(function (res) { return res.json(); })
    .then(function (data) {
      var a = data.result;
      if (!a) return;

      var bio = document.getElementById('about-bio');
      if (bio && a.bio) bio.textContent = a.bio;

      setEmbed('spotify-embed', spotifyEmbedUrl(a.spotifyUrl));
      setEmbed('instagram-embed', a.instagramWidgetUrl);
    })
    .catch(function (err) { console.error('About fetch failed:', err); });

  function spotifyEmbedUrl(shareUrl) {
    if (!shareUrl) return null;
    var match = shareUrl.match(/playlist\/([a-zA-Z0-9]+)/);
    if (!match) return null;
    return 'https://open.spotify.com/embed/playlist/' + match[1];
  }

  function setEmbed(wrapperId, src) {
    var wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;
    if (!src) {
      wrapper.hidden = true;
      return;
    }
    var iframe = wrapper.querySelector('iframe');
    if (iframe) iframe.src = src;
    wrapper.hidden = false;
  }
})();

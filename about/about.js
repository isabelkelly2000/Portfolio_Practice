(function () {
  var PROJECT_ID = 'rk7q4uop';
  var DATASET = 'production';

  var query = '*[_type == "about"][0]{ bio, spotifyUrl, instagramFeedId }';

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
      setInstagramEmbed(a.instagramFeedId);
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

  function setInstagramEmbed(feedId) {
    var wrapper = document.getElementById('instagram-embed');
    if (!wrapper) return;
    if (!feedId) {
      wrapper.hidden = true;
      return;
    }
    var widget = document.getElementById('behold-widget');
    if (widget) widget.setAttribute('feed-id', feedId);
    loadBeholdScript();
    wrapper.hidden = false;
  }

  function loadBeholdScript() {
    if (window.__bhldScript) return;
    window.__bhldScript = true;
    var s = document.createElement('script');
    s.type = 'module';
    s.src = 'https://w.behold.so/widget.js';
    document.head.appendChild(s);
  }
})();

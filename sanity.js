(function () {
  var PROJECT_ID = 'rk7q4uop';
  var DATASET = 'production';
  var query = '*[_type == "project"] | order(order asc) {title, "slug": slug.current, company, role, description, deliverables, "coverImageUrl": coverImage.asset->url, tags, template}';
  var url = 'https://' + PROJECT_ID + '.apicdn.sanity.io/v2021-10-21/data/query/' + DATASET + '?query=' + encodeURIComponent(query);

  var grid = document.querySelector('.projects-grid');
  if (!grid) return;

  fetch(url)
    .then(function (res) { return res.json(); })
    .then(function (data) {
      var projects = data.result;
      if (!projects || projects.length === 0) {
        grid.innerHTML = '';
        return;
      }
      grid.innerHTML = '';
      projects.forEach(function (project) {
        grid.appendChild(createCard(project));
      });
      setSidebarTop();
      window.addEventListener('resize', setSidebarTop);
    })
    .catch(function (err) {
      console.error('Sanity fetch failed:', err);
    });

  function createCard(project) {
    var template = project.template || 'casestudy.html';
    var href = project.slug ? template + '?slug=' + encodeURIComponent(project.slug) : null;

    var wrapper = href ? document.createElement('a') : document.createElement('div');
    if (href) {
      wrapper.href = href;
      wrapper.style.cssText = 'text-decoration:none;color:inherit;display:block;';
    }

    var article = document.createElement('article');
    article.className = 'project-card';

    // Left: text info
    var infoDiv = document.createElement('div');
    infoDiv.className = 'project-info';

    var title = document.createElement('h3');
    title.className = 'project-title';
    title.textContent = project.title || '';

    var metaDiv = document.createElement('div');
    metaDiv.className = 'project-meta';

    var company = document.createElement('span');
    company.className = 'project-company';
    company.textContent = project.company || '';

    var dot = document.createElement('span');
    dot.className = 'meta-dot';

    var roleTag = document.createElement('span');
    roleTag.className = 'project-role-tag';
    roleTag.textContent = project.role || '';

    metaDiv.appendChild(company);
    metaDiv.appendChild(dot);
    metaDiv.appendChild(roleTag);

    var pillsDiv = document.createElement('div');
    pillsDiv.className = 'project-pills';

    if (Array.isArray(project.tags)) {
      project.tags.forEach(function (item) {
        var pill = document.createElement('span');
        pill.className = 'project-pill';
        pill.textContent = item;
        pillsDiv.appendChild(pill);
      });
    }

    var leftDiv = document.createElement('div');
    leftDiv.className = 'project-left';
    leftDiv.appendChild(title);
    leftDiv.appendChild(metaDiv);

    infoDiv.appendChild(leftDiv);
    infoDiv.appendChild(pillsDiv);

    // Top: image
    var imageDiv = document.createElement('div');
    imageDiv.className = 'project-image';

    if (project.coverImageUrl) {
      var img = document.createElement('img');
      img.src = project.coverImageUrl;
      img.alt = project.title || '';
      imageDiv.appendChild(img);
    } else {
      ['long', 'medium', 'short'].forEach(function (size) {
        var line = document.createElement('div');
        line.className = 'img-line ' + size;
        imageDiv.appendChild(line);
      });
    }

    article.appendChild(imageDiv);
    article.appendChild(infoDiv);
    wrapper.appendChild(article);

    return wrapper;
  }

  function setSidebarTop() {
    var nav = document.querySelector('nav');
    var sidebar = document.querySelector('.work-sidebar');
    if (sidebar && nav) {
      sidebar.style.top = nav.offsetHeight + 'px';
    }
  }

})();

(function () {
  var root = document.documentElement;
  try { var t = localStorage.getItem('theme'); if (t) root.setAttribute('data-theme', t); } catch (e) {}
  document.getElementById('theme').addEventListener('click', function () {
    var dark = root.getAttribute('data-theme') === 'dark' ||
      (!root.getAttribute('data-theme') && matchMedia('(prefers-color-scheme: dark)').matches);
    var next = dark ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // a bus seat map: 10 rows of 2 + aisle + 2
  var seats = document.getElementById('seats'), html = '';
  var sold = [0, 1, 3, 4, 7, 8, 11, 12, 13, 16, 17, 19, 22, 25, 26, 30, 31, 34, 36], held = [5, 14, 27];
  var n = 0;
  for (var r = 0; r < 10; r++) {
    for (var c = 0; c < 5; c++) {
      if (c === 2) { html += '<i class="gap"></i>'; continue; }
      var cls = sold.indexOf(n) >= 0 ? 'sold' : held.indexOf(n) >= 0 ? 'held' : '';
      html += '<i class="' + cls + '"></i>'; n++;
    }
  }
  seats.innerHTML = html;

  // reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else items.forEach(function (el) { el.classList.add('in'); });

  // highlight the section in view
  var links = [].slice.call(document.querySelectorAll('#nav a'));
  var secs = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  addEventListener('scroll', function () {
    var y = scrollY + 120, cur = -1;
    secs.forEach(function (s, i) { if (s && s.offsetTop <= y) cur = i; });
    links.forEach(function (a, i) { a.classList.toggle('on', i === cur); });
  }, { passive: true });
})();

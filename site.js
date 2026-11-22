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

  // contact form: no server, so it hands the message to the visitor's own mail app or WhatsApp
  var form = document.getElementById('contact-form');
  if (form) {
    var via = 'mail';
    [].forEach.call(form.querySelectorAll('button[type=submit]'), function (b) {
      b.addEventListener('click', function () { via = b.getAttribute('data-via'); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements, note = document.getElementById('form-note');
      var name = f.name.value.trim(), reply = f.reply.value.trim(), msg = f.message.value.trim();
      if (!name || !reply || !msg) { note.textContent = 'Please fill in your name, how to reach you, and a message.'; return; }
      var body = msg + '\n\n' + name + '\n' + reply;
      var url = via === 'wa'
        ? 'https://wa.me/' + form.getAttribute('data-wa') + '?text=' + encodeURIComponent('Hi Zeeshan, ' + body)
        : 'mailto:' + form.getAttribute('data-mail') + '?subject=' + encodeURIComponent('Portfolio message from ' + name) + '&body=' + encodeURIComponent(body);
      note.textContent = via === 'wa' ? 'Opening WhatsApp…' : 'Opening your email app… if nothing opens, write to ' + form.getAttribute('data-mail') + '.';
      window.open(url, via === 'wa' ? '_blank' : '_self', 'noopener');
    });
  }

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

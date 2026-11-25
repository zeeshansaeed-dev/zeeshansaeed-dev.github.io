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

  // Kind words slider: arrows, dots, and "Read more" on quotes that were cut short
  var track = document.getElementById('quotes');
  if (track) {
    var cards = [].slice.call(track.children), dots = document.getElementById('q-dots');
    var prev = document.getElementById('q-prev'), next = document.getElementById('q-next');
    var step = function () { return cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth; };
    var spots = function () { return Math.max(1, cards.length - Math.round(track.clientWidth / step()) + 1); }; // places the row can rest at
    var here = function () { return Math.min(spots() - 1, Math.round(track.scrollLeft / step())); };
    var goTo = function (i) { track.scrollTo({ left: i * step() }); };
    var draw = function () {
      var n = spots(), cur = here();
      if (dots.children.length !== n) {
        dots.innerHTML = '';
        for (var i = 0; i < n; i++) (function (i) {
          var b = document.createElement('button');
          b.type = 'button'; b.setAttribute('aria-label', 'Show recommendation ' + (i + 1));
          b.addEventListener('click', function () { goTo(i); });
          dots.appendChild(b);
        })(i);
      }
      [].forEach.call(dots.children, function (b, i) { b.setAttribute('aria-current', i === cur ? 'true' : 'false'); });
      prev.disabled = track.scrollLeft < 4;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      document.querySelector('.slider-bar').style.display = n > 1 ? '' : 'none';
    };
    prev.addEventListener('click', function () { goTo(Math.max(0, here() - 1)); });
    next.addEventListener('click', function () { goTo(Math.min(spots() - 1, here() + 1)); });
    track.addEventListener('scroll', draw, { passive: true });

    cards.forEach(function (card) {
      var bq = card.querySelector('blockquote'), btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'more'; btn.textContent = 'Read more'; btn.hidden = true;
      card.insertBefore(btn, card.querySelector('figcaption'));
      btn.addEventListener('click', function () {
        var open = card.classList.toggle('open');
        btn.textContent = open ? 'Show less' : 'Read more';
        btn.setAttribute('aria-expanded', open);
      });
      card._check = function () { if (!card.classList.contains('open')) btn.hidden = bq.scrollHeight <= bq.clientHeight + 1; };
    });
    var fit = function () { cards.forEach(function (c) { c._check(); }); draw(); };
    addEventListener('resize', fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    fit();
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

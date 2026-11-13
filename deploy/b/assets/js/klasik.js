/* Antoni — záložná klasická verzia: dnešné menu z Lista, karusel recenzií, galéria. */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  function now() {
    var q = new URLSearchParams(location.search).get('dnes');
    if (q) { var d = new Date(q.length <= 10 ? q + 'T12:00:00' : q); if (!isNaN(d)) return d; }
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Bratislava' }));
  }
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function eur(v) { return v.toFixed(2).replace('.', ',') + ' €'; }

  // dnešné denné menu (obsah z Listo feedu, forma z webu)
  function todayMenu() {
    var box = $('[data-today-menu]');
    var shortEl = $('[data-today-short]');
    var feed = null;
    try { feed = JSON.parse($('#listo-feed').textContent); } catch (e) { feed = null; }
    if (!feed) return;
    var d = now();
    var day = feed.days.filter(function (x) { return x.date === iso(d); })[0];
    if (day) {
      if (shortEl) shortEl.innerHTML = '<span class="dot dot--live"></span>Dnes od 11:00 · polievka + ' + (day.items.length - 1) + ' jedlá';
      if (box) {
        $('[data-today-date]').textContent = day.label + ' ' + d.getDate() + '. ' + (d.getMonth() + 1) + '.';
        box.innerHTML = '<ul class="day-items">' + day.items.map(function (it) {
          var price = it.price ? eur(it.price) : '<span class="muted small">v cene menu</span>';
          return '<li class="day-item"><span class="day-item__slot">' + esc(it.slot) + '</span><span class="day-item__name">' + esc(it.name) +
            '</span><span class="day-item__price price">' + price + '</span><span class="day-item__meta">' + esc(it.portion) +
            ' · alergény ' + ((it.allergens || []).join(', ') || '—') + '</span></li>';
        }).join('') + '</ul>';
      }
    } else {
      var weekend = d.getDay() === 0 || d.getDay() === 6;
      if (shortEl) shortEl.textContent = weekend ? 'Cez víkend varíme à la carte' : 'Menu na tento týždeň pripravujeme';
      if (box) {
        $('[data-today-title]').textContent = weekend ? 'Cez víkend à la carte' : 'Denné menu pripravujeme';
        box.innerHTML = '<p class="muted">' + (weekend
          ? 'Denné menu podávame v pracovné dni od 11:00. Menu na nový týždeň zverejníme do pondelka.'
          : 'Menu na tento týždeň zverejníme v priebehu dňa.') +
          '</p><p style="margin-top:16px"><a class="textlink" href="ponuka.html">À la carte lístok</a></p>';
      }
    }
  }

  // karusel recenzií
  function carousel() {
    var track = $('[data-carousel]');
    if (!track) return;
    function step(dir) {
      var item = track.firstElementChild;
      var w = item ? item.getBoundingClientRect().width + 24 : track.clientWidth;
      track.scrollBy({ left: dir * w, behavior: 'smooth' });
    }
    var prev = $('[data-carousel-prev]'), next = $('[data-carousel-next]');
    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });
    function upd() {
      var max = track.scrollWidth - track.clientWidth - 4;
      if (prev) prev.disabled = track.scrollLeft <= 4;
      if (next) next.disabled = track.scrollLeft >= max;
    }
    track.addEventListener('scroll', upd, { passive: true });
    upd();
  }

  // galéria so zväčšením
  function lightbox() {
    var dlg = $('[data-lightbox-dialog]');
    if (!dlg || !dlg.showModal) return;
    var img = $('[data-lightbox-img]', dlg);
    $$('[data-lightbox]').forEach(function (b) {
      b.addEventListener('click', function () {
        img.src = b.dataset.lightbox;
        img.alt = ($('img', b) || {}).alt || '';
        dlg.showModal();
      });
    });
    $('[data-lightbox-close]', dlg).addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  }

  function boot() { todayMenu(); carousel(); lightbox(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();

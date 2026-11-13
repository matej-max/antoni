/* ==========================================================================
   Antoni restaurant — správanie webu
   - otváracie hodiny „teraz“ (Europe/Bratislava)
   - denné menu z Listo feedu (schema_version 1) — obsah, nie forma
   - rezervačný formulár (požiadavka), menu/drawer, sheety, náhľady jedál
   - pohyb: Lenis + GSAP ScrollTrigger (len ak nie je prefers-reduced-motion)
   ========================================================================== */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var page = document.body.dataset.page;
  var lenis = null;

  /* ---------------------------------------------------------------- čas */
  // Otváracie hodiny: index = getDay() (0 = nedeľa)
  var HOURS = [
    [11, 21], [11, 21], [11, 21], [11, 21], [11, 21], [11, 22], [11, 22]
  ];
  var DAY_NAMES = ['nedeľa', 'pondelok', 'utorok', 'streda', 'štvrtok', 'piatok', 'sobota'];
  var DAY_SHORT = ['Ne', 'Po', 'Ut', 'St', 'Št', 'Pi', 'So'];

  // ?dnes=2026-09-30T12:00 — simulácia dátumu pre náhľad prototypu
  function now() {
    var q = new URLSearchParams(location.search).get('dnes');
    if (q) {
      var d = new Date(q.length <= 10 ? q + 'T12:00:00' : q);
      if (!isNaN(d)) return d;
    }
    var s = new Date().toLocaleString('en-US', { timeZone: 'Europe/Bratislava' });
    return new Date(s);
  }
  function iso(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function hhmm(mins) {
    return String(Math.floor(mins / 60)).padStart(2, '0') + ':' + String(mins % 60).padStart(2, '0');
  }

  /* ------------------------------------------------------ otvorené teraz */
  function openStatus() {
    var d = now();
    var day = d.getDay();
    var mins = d.getHours() * 60 + d.getMinutes();
    var h = HOURS[day];
    var text, live = false;
    if (mins >= h[0] * 60 && mins < h[1] * 60) {
      live = true;
      text = 'Otvorené · dnes do ' + h[1] + ':00';
    } else if (mins < h[0] * 60) {
      text = 'Zatvorené · otvárame o ' + h[0] + ':00';
    } else {
      var n = HOURS[(day + 1) % 7];
      text = 'Zatvorené · zajtra od ' + n[0] + ':00';
    }
    $$('[data-open-status]').forEach(function (el) {
      el.innerHTML = '<span class="dot ' + (live ? 'dot--live' : 'dot--off') + '"></span>' + text;
    });
    $$('[data-hours] li').forEach(function (li) {
      li.classList.toggle('is-today', +li.dataset.day === day);
    });
  }

  /* ------------------------------------------------------ Listo feed */
  var feed = null;
  try { feed = JSON.parse($('#listo-feed').textContent); } catch (e) { feed = null; }

  function eur(v) { return v.toFixed(2).replace('.', ',') + ' €'; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmtDate(isoStr) { var p = isoStr.split('-'); return +p[2] + '. ' + +p[1] + '.'; }

  function todayMenu() {
    if (!feed) return { state: 'none' };
    var t = iso(now());
    var day = feed.days.filter(function (d) { return d.date === t; })[0];
    if (day) return { state: 'today', day: day };
    var wd = now().getDay();
    if (wd === 0 || wd === 6) return { state: 'weekend' };
    return { state: 'none' };
  }

  function dayItemsHtml(day) {
    return '<ul class="day-items">' + day.items.map(function (it) {
      var price = it.price ? eur(it.price) : '<span class="muted small">v cene menu</span>';
      var al = (it.allergens || []).join(', ') || '—';
      return '<li class="day-item"><span class="day-item__slot">' + esc(it.slot) + '</span>' +
        '<span class="day-item__name">' + esc(it.name) + '</span>' +
        '<span class="day-item__price price">' + price + '</span>' +
        '<span class="day-item__meta">' + esc(it.portion) + ' · alergény ' + al + '</span></li>';
    }).join('') + '</ul>';
  }

  function todayPill() {
    var tm = todayMenu();
    var dot = $('[data-today-dot]');
    var label = $('[data-today-label]');
    if (!dot) return;
    if (tm.state === 'today') { dot.classList.add('dot--live'); label.textContent = 'Obed dnes'; }
    else { dot.classList.add('dot--off'); label.textContent = 'Denné menu'; }
  }

  function openTodaySheet(e) {
    if (page === 'denne-menu') return;
    if (e) e.preventDefault();
    var tm = todayMenu();
    var body;
    var d = now();
    if (tm.state === 'today') {
      body = '<div class="today-sheet__head"><p class="when">' + tm.day.label + ' · ' + fmtDate(tm.day.date) + ' · od 11:00</p>' +
        '<h2 id="today-sheet-title">Dnes na obed</h2></div>' + dayItemsHtml(tm.day) +
        '<p style="margin-top:20px;display:flex;gap:12px;flex-wrap:wrap"><a class="btn btn--sm" href="denne-menu.html">Celý týždeň</a>' +
        '<a class="btn btn--sm btn--ghost" href="tel:+421948871984">Objednať · 0948 871 984</a></p>';
    } else if (tm.state === 'weekend') {
      body = '<div class="today-sheet__head"><p class="when">' + DAY_NAMES[d.getDay()] + '</p><h2 id="today-sheet-title">Cez víkend varíme à la carte</h2></div>' +
        '<p class="muted" style="margin-top:12px">Denné menu podávame v pracovné dni od 11:00. Menu na nový týždeň zverejníme do pondelka.</p>' +
        '<p style="margin-top:20px;display:flex;gap:12px;flex-wrap:wrap"><a class="btn btn--sm" href="ponuka.html">À la carte lístok</a><a class="btn btn--sm btn--ghost" href="denne-menu.html">Minulý týždeň</a></p>';
    } else {
      body = '<div class="today-sheet__head"><h2 id="today-sheet-title">Denné menu pripravujeme</h2></div>' +
        '<p class="muted" style="margin-top:12px">Menu na tento týždeň ešte nie je zverejnené. Zavolajte nám na 0948 871 984.</p>';
    }
    openSheet('today-sheet', body, e && e.currentTarget);
  }

  /* ---------------------------------------------------------- sheety */
  var lastFocus = null;
  function trapFocus(container, e) {
    if (e.key !== 'Tab') return;
    var f = $$('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])', container)
      .filter(function (el) { return el.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function lockScroll(on) {
    if (lenis) { on ? lenis.stop() : lenis.start(); }
    document.body.style.overflow = on ? 'hidden' : '';
  }
  function openSheet(id, html, opener) {
    var s = document.getElementById(id);
    if (!s) return;
    $('[data-sheet-body]', s).innerHTML = html;
    lastFocus = opener || document.activeElement;
    s.hidden = false;
    requestAnimationFrame(function () { requestAnimationFrame(function () { s.classList.add('is-open'); }); });
    lockScroll(true);
    setTimeout(function () { var c = $('.sheet__close', s); if (c) c.focus({ preventScroll: true }); }, 60);
  }
  function closeSheet(s) {
    s.classList.remove('is-open');
    lockScroll(false);
    setTimeout(function () { s.hidden = true; }, 600);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  function initSheets() {
    $$('[data-sheet]').forEach(function (s) {
      s.addEventListener('click', function (e) { if (e.target.closest('[data-sheet-close]')) closeSheet(s); });
      s.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeSheet(s);
        trapFocus($('.sheet__panel', s), e);
      });
    });
  }

  /* ---------------------------------------------------------- drawer */
  function initDrawer() {
    var d = $('[data-drawer]');
    var btn = $('[data-drawer-open]');
    if (!d || !btn) return;
    function open() {
      d.hidden = false;
      requestAnimationFrame(function () { requestAnimationFrame(function () { d.classList.add('is-open'); }); });
      btn.setAttribute('aria-expanded', 'true');
      lockScroll(true);
      setTimeout(function () { $('[data-drawer-close]', d).focus({ preventScroll: true }); }, 80);
    }
    function close() {
      d.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      lockScroll(false);
      setTimeout(function () { d.hidden = true; }, 800);
      btn.focus({ preventScroll: true });
    }
    btn.addEventListener('click', open);
    $('[data-drawer-close]', d).addEventListener('click', close);
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); trapFocus(d, e); });
    $$('.drawer__nav a', d).forEach(function (a) { a.addEventListener('click', function () { if (a.hash && a.pathname === location.pathname) close(); }); });
  }

  /* ---------------------------------------------------------- header */
  function initHeader() {
    var h = $('[data-header]');
    if (!h) return;
    var lastY = window.scrollY, ticking = false, travel = 0, hidden = false;
    var heroEnd = page === 'index' ? window.innerHeight * 0.9 : 40;
    // Hysterézia: hlavička sa schová až po 32 px súvislého scrollu dole a ukáže po 8 px hore.
    // Pixelové chvenie (dojazd plynulého scrollu, zaokrúhľovanie) jej stav nemení.
    var HIDE_AFTER = 32, SHOW_AFTER = 8;
    root.classList.add('header-visible');
    function setHidden(v) {
      if (v === hidden) return;
      hidden = v;
      h.classList.toggle('is-hidden', v);
      root.classList.toggle('header-visible', !v);
    }
    function update() {
      ticking = false;
      var y = Math.round(window.scrollY);
      var dy = y - lastY;
      lastY = y;
      h.classList.toggle('is-solid', y > heroEnd || (page !== 'index' && y > 10));
      if (y < 160) { travel = 0; setHidden(false); return; }
      if (dy === 0) return;
      if ((dy > 0) !== (travel > 0)) travel = 0;
      travel += dy;
      if (travel > HIDE_AFTER && !h.contains(document.activeElement)) setHidden(true);
      else if (travel < -SHOW_AFTER) setHidden(false);
    }
    window.addEventListener('scroll', function () { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
    window.addEventListener('resize', function () { heroEnd = page === 'index' ? window.innerHeight * 0.9 : 40; });
    h.addEventListener('focusin', function () { setHidden(false); });
    update();
  }

  /* ---------------------------------------------------- jedlá: náhľad */
  function initDishes() {
    var items = $$('.item--photo');
    if (!items.length) return;
    var peek = document.createElement('div');
    peek.className = 'peek';
    peek.setAttribute('aria-hidden', 'true');
    var peekImg = document.createElement('img');
    peekImg.alt = '';
    peekImg.decoding = 'async';
    peek.appendChild(peekImg);
    document.body.appendChild(peek);
    var fine = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 900px)');
    var px = 0, py = 0, cx = 0, cy = 0, raf = null;

    function sheetFor(it) {
      var m = it.dataset;
      var html = '<div class="dish-photo"><img src="' + m.photoLg + '" alt="' + esc(m.name) + '"></div>' +
        '<h2 id="dish-sheet-title">' + esc(m.name) + '</h2>' +
        (m.desc ? '<p class="muted" style="margin-top:8px">' + esc(m.desc) + '</p>' : '') +
        '<p style="display:flex;justify-content:space-between;gap:16px;margin-top:16px;padding-top:14px;border-top:1px solid var(--line)">' +
        '<span class="small muted">' + esc($('.item__meta', it).textContent) + '</span><span class="price">' + esc(m.price) + '</span></p>';
      openSheet('dish-sheet', html, it);
    }
    items.forEach(function (it) {
      it.addEventListener('click', function () { sheetFor(it); });
      it.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sheetFor(it); } });
      it.addEventListener('mouseenter', function () {
        if (!fine.matches || !peek) return;
        peekImg.src = it.dataset.photoSm;
        peek.classList.add('is-on');
      });
      it.addEventListener('mouseleave', function () { if (peek) peek.classList.remove('is-on'); });
    });
    if (!peek) return;
    window.addEventListener('mousemove', function (e) {
      px = e.clientX + 28; py = e.clientY - 160;
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    function loop() {
      cx += (px - cx) * 0.18; cy += (py - cy) * 0.18;
      var maxX = window.innerWidth - 280;
      peek.style.transform = 'translate3d(' + Math.min(cx, maxX) + 'px,' + Math.max(16, cy) + 'px,0) rotate(' + ((px - cx) * 0.02).toFixed(2) + 'deg)';
      raf = (Math.abs(px - cx) > 0.5 || Math.abs(py - cy) > 0.5) ? requestAnimationFrame(loop) : null;
    }
  }

  /* --------------------------------------------- lepkavá navigácia kategórií */
  function initCatnav() {
    var nav = $('[data-catnav]');
    if (!nav) return;
    var links = $$('a', nav);
    var map = {};
    links.forEach(function (a) { map[a.hash.slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) { a.classList.remove('is-active'); });
          var a = map[en.target.id];
          if (a) {
            a.classList.add('is-active');
            var inner = a.parentElement;
            inner.scrollTo({ left: a.offsetLeft - inner.clientWidth / 2 + a.clientWidth / 2, behavior: 'smooth' });
          }
        }
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ---------------------------------------------------- denné menu */
  function initWeek() {
    var tabs = $$('.daytab');
    if (!tabs.length) return;
    var t = iso(now());
    var wd = now().getDay();
    var todayTab = null;
    tabs.forEach(function (tab) {
      var d = tab.dataset.date;
      if (d < t) tab.classList.add('is-past');
      if (d === t) { tab.classList.add('is-today'); todayTab = tab; }
    });
    function select(tab, focus) {
      tabs.forEach(function (x) {
        var on = x === tab;
        x.setAttribute('aria-selected', on ? 'true' : 'false');
        x.tabIndex = on ? 0 : -1;
        document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
    }
    var notice = $('[data-weekend]');
    var allPast = tabs.every(function (x) { return x.dataset.date < t; });
    if (todayTab) select(todayTab);
    else if (allPast) {
      if (notice) {
        notice.hidden = false;
        if (wd !== 0 && wd !== 6) {
          $('.h3', notice).textContent = 'Menu na tento týždeň pripravujeme';
          $('p.muted', notice).textContent = 'Zverejníme ho v priebehu dňa. Dovtedy si môžete pozrieť minulý týždeň alebo à la carte lístok.';
        }
      }
      select(tabs[tabs.length - 1]);
    } else select(tabs[0]);
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab); });
      tab.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') select(tabs[(i + 1) % tabs.length], true);
        if (e.key === 'ArrowLeft') select(tabs[(i - 1 + tabs.length) % tabs.length], true);
      });
    });
  }

  /* ---------------------------------------------------- odometer hodín */
  function Odometer(el) {
    var cols = [];
    var str = el.textContent.trim();
    el.textContent = '';
    el.classList.add('odo');
    el.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < 5; i++) {
      if (i === 2) { var sep = document.createElement('span'); sep.className = 'odo__sep'; sep.textContent = ':'; el.appendChild(sep); cols.push(null); continue; }
      var c = document.createElement('span'); c.className = 'odo__col';
      c.innerHTML = '0123456789–'.split('').map(function (ch) { return '<span>' + ch + '</span>'; }).join('');
      el.appendChild(c); cols.push(c);
    }
    // šírka stĺpca = šírka práve zobrazenej číslice (Rosalia nemá tabuľkové číslice)
    var widths = {};
    var probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;font:inherit;';
    el.appendChild(probe);
    '0123456789–'.split('').forEach(function (ch) { probe.textContent = ch; widths[ch] = probe.getBoundingClientRect().width; });
    el.removeChild(probe);
    function set(v) {
      for (var i = 0; i < 5; i++) {
        if (!cols[i]) continue;
        var ch = v.charAt(i);
        var idx = /\d/.test(ch) ? +ch : 10;
        cols[i].style.transform = 'translateY(' + (-idx) + 'em)';
        var w = widths[/\d/.test(ch) ? ch : '–'];
        if (w) cols[i].style.width = w.toFixed(2) + 'px';
      }
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () {
      '0123456789–'.split('').forEach(function (ch) { probe.textContent = ch; el.appendChild(probe); widths[ch] = probe.getBoundingClientRect().width; el.removeChild(probe); });
      set(current);
    });
    var current = str;
    var setRaw = set;
    set = function (v) { current = v; setRaw(v); };
    set(str);
    return { set: set };
  }

  var clock = null;
  function initClock() {
    var t = $('[data-clock-time]');
    if (!t) return;
    clock = { odo: Odometer(t), label: $('[data-clock-label]'), locked: false };
  }
  var currentChapter = null;
  function setChapter(ch) {
    if (!ch || ch === currentChapter) return;
    currentChapter = ch;
    var time = ch.dataset.time, label = ch.dataset.label;
    if (clock && !clock.locked) {
      clock.odo.set(time);
      clock.label.textContent = label;
    }
    $$('[data-rail-to]').forEach(function (a) { a.classList.toggle('is-active', a.dataset.railTo === ch.id); });
    if (window.gsap && root.classList.contains('has-motion') && ch.dataset.tone) {
      gsap.to(document.body, { backgroundColor: ch.dataset.tone, duration: 1.2, ease: 'power2.out', overwrite: true });
    }
    var bar = $('[data-bar]');
    if (bar) {
      bar.classList.toggle('is-away', ch.id === 'rezervacia');
    }
    var rail = $('[data-rail]');
    if (rail) rail.classList.toggle('is-intro', ch.hasAttribute('data-rail-hide'));
  }
  function initChaptersStatic() {
    var chapters = $$('[data-chapter]');
    if (!chapters.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) setChapter(en.target); });
    }, { rootMargin: '-38% 0px -61% 0px' });
    chapters.forEach(function (c) { io.observe(c); });
  }

  /* ---------------------------------------------------- rezervácia */
  function initReserve() {
    $$('[data-reserve]').forEach(function (wrap) {
      var form = $('[data-reserve-form]', wrap);
      var chipsEl = $('[data-day-chips]', form);
      var dateInput = $('[data-date-input]', form);
      var slotsEl = $('[data-slots]', form);
      var guestsOut = $('[data-guests]', form);
      var guestsIn = $('input[name="guests"]', form);
      var occasion = $('select[name="occasion"]', form);
      var uid = Math.random().toString(36).slice(2, 7);
      var base = now();
      var today = new Date(base.getFullYear(), base.getMonth(), base.getDate());

      dateInput.min = iso(today);
      var max = new Date(today); max.setDate(max.getDate() + 90); dateInput.max = iso(max);

      // rýchla voľba dní
      var chipHtml = '';
      for (var i = 0; i < 7; i++) {
        var d = new Date(today); d.setDate(d.getDate() + i);
        var lbl = i === 0 ? 'Dnes' : i === 1 ? 'Zajtra' : DAY_SHORT[d.getDay()] + ' ' + d.getDate() + '. ' + (d.getMonth() + 1) + '.';
        chipHtml += '<label class="chip"><input type="radio" name="day-' + uid + '" value="' + iso(d) + '"><span>' + lbl + '</span></label>';
      }
      chipsEl.innerHTML = chipHtml;

      function slotsFor(isoDate) {
        var p = isoDate.split('-');
        var d = new Date(+p[0], +p[1] - 1, +p[2]);
        var h = HOURS[d.getDay()];
        var out = [];
        var isToday = isoDate === iso(today);
        var nowMins = base.getHours() * 60 + base.getMinutes() + 60; // min. hodinu vopred
        for (var m = h[0] * 60; m <= (h[1] - 1) * 60; m += 30) {
          out.push({ t: hhmm(m), disabled: isToday && m < nowMins });
        }
        return out;
      }
      function renderSlots(isoDate, keep) {
        var prev = keep || (($('input:checked', slotsEl) || {}).value);
        var list = slotsFor(isoDate);
        slotsEl.innerHTML = list.map(function (s) {
          return '<label class="slot"><input type="radio" name="time-' + uid + '" value="' + s.t + '"' + (s.disabled ? ' disabled' : '') + '><span>' + s.t + '</span></label>';
        }).join('');
        var pick = list.filter(function (s) { return s.t === prev && !s.disabled; })[0] ||
          list.filter(function (s) { return s.t === '19:00' && !s.disabled; })[0] ||
          list.filter(function (s) { return !s.disabled && s.t >= '18:00'; })[0];
        if (pick) { $('input[value="' + pick.t + '"]', slotsEl).checked = true; showTime(pick.t); }
        // posuň na večer
        var target = $('input[value="18:00"]', slotsEl) || $('input:not(:disabled)', slotsEl);
        if (target) slotsEl.scrollLeft = target.parentElement.offsetLeft - 16;
        if (!list.some(function (s) { return !s.disabled; })) {
          slotsEl.innerHTML = '<p class="small muted">Na dnes už stôl online nestihneme pripraviť. Vyberte iný deň alebo zavolajte.</p>';
        }
      }
      function setDate(v) {
        dateInput.value = v;
        $$('input', chipsEl).forEach(function (r) { r.checked = r.value === v; });
        renderSlots(v);
        dateInput.closest('.field').classList.remove('is-invalid');
      }
      chipsEl.addEventListener('change', function (e) { setDate(e.target.value); });
      dateInput.addEventListener('change', function () { if (dateInput.value) setDate(dateInput.value); });
      function showTime(t) {
        var rc = $('[data-reserve-clock]');
        if (rc) { if (rc._odo) rc._odo.set(t); else { rc.textContent = t; rc._odo = Odometer(rc); } }
      }
      slotsEl.addEventListener('change', function (e) {
        slotsEl.closest('.field').classList.remove('is-invalid');
        if (e.target.value) showTime(e.target.value);
      });

      var defaultDay = iso(today);
      if (base.getHours() >= HOURS[base.getDay()][1] - 2) { var tm = new Date(today); tm.setDate(tm.getDate() + 1); defaultDay = iso(tm); }
      setDate(defaultDay);

      // hostia
      var guests = 2;
      function setGuests(n) {
        guests = Math.max(1, Math.min(12, n));
        guestsOut.textContent = guests;
        guestsIn.value = guests;
        $('[data-step="-1"]', form).disabled = guests <= 1;
        $('[data-step="1"]', form).disabled = guests >= 12;
      }
      $$('[data-step]', form).forEach(function (b) { b.addEventListener('click', function () { setGuests(guests + +b.dataset.step); }); });
      setGuests(2);

      // príležitosť z odkazu (napr. „Rezervovať na hody“)
      $$('[data-occasion]').forEach(function (a) {
        a.addEventListener('click', function () { if (occasion) occasion.value = a.dataset.occasion; });
      });
      var q = new URLSearchParams(location.search).get('prilezitost');
      if (q && occasion) occasion.value = q;

      // validácia + odoslanie
      $$('input, textarea', form).forEach(function (el) {
        el.addEventListener('input', function () { var f = el.closest('.field'); if (f) f.classList.remove('is-invalid'); });
        el.addEventListener('change', function () { var f = el.closest('.field'); if (f) f.classList.remove('is-invalid'); });
      });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var bad = [];
        var time = $('input:checked', slotsEl);
        if (!dateInput.value) bad.push(dateInput.closest('.field'));
        if (!time) bad.push(slotsEl.closest('.field'));
        ['name', 'tel'].forEach(function (n) {
          var el = $('[name="' + n + '"]', form);
          var ok = n === 'tel' ? /[\d\s+]{9,}/.test(el.value) : el.value.trim().length > 1;
          if (!ok) bad.push(el.closest('.field'));
        });
        var consent = $('[name="consent"]', form);
        if (!consent.checked) bad.push(consent.closest('.field'));
        bad.forEach(function (f) { f.classList.add('is-invalid'); });
        if (bad.length) {
          var first = $('input, textarea, button', bad[0]);
          if (first) first.focus();
          return;
        }
        var btn = $('button[type="submit"]', form);
        btn.classList.add('is-loading');
        btn.setAttribute('aria-busy', 'true');
        // Prototyp: v Laraveli POST /rezervacia → Filament (Reservations) + notifikácia personálu
        setTimeout(function () {
          btn.classList.remove('is-loading');
          btn.removeAttribute('aria-busy');
          var p = dateInput.value.split('-');
          var d = new Date(+p[0], +p[1] - 1, +p[2]);
          var when = DAY_NAMES[d.getDay()] + ' ' + d.getDate() + '. ' + (d.getMonth() + 1) + '. · ' + time.value;
          $('[data-rc-name]', wrap).textContent = $('[name="name"]', form).value.trim();
          $('[data-rc-when]', wrap).textContent = when.charAt(0).toUpperCase() + when.slice(1);
          $('[data-rc-guests]', wrap).textContent = guests + (guests === 1 ? ' hosť' : guests < 5 ? ' hostia' : ' hostí');
          wrap.classList.add('is-sent');
          var card = $('.reserve-card', wrap);
          card.focus({ preventScroll: true });
          if (window.gsap && root.classList.contains('has-motion')) {
            gsap.fromTo(card, { y: 40, opacity: 0, rotate: -1.5 }, { y: 0, opacity: 1, rotate: 0, duration: 1.1, ease: 'expo.out' });
          }
          if (clock) { clock.locked = true; clock.odo.set(time.value); clock.label.textContent = 'Váš stôl'; }
        }, 900);
      });
      $('[data-rc-edit]', wrap).addEventListener('click', function () {
        wrap.classList.remove('is-sent');
        $('[name="name"]', form).focus();
      });
    });
  }

  /* ---------------------------------------------------- dopyt na oslavu */
  function initInquiry() {
    $$('[data-inquiry]').forEach(function (wrap) {
      var form = $('[data-inquiry-form]', wrap);
      var done = $('.inquiry-done', wrap);
      $$('input, textarea', form).forEach(function (el) {
        el.addEventListener('change', function () { var f = el.closest('.field'); if (f) f.classList.remove('is-invalid'); });
        el.addEventListener('input', function () { var f = el.closest('.field'); if (f) f.classList.remove('is-invalid'); });
      });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var bad = [];
        if (!$('input[name="type"]:checked', form)) bad.push($('input[name="type"]', form).closest('.field'));
        if ($('[name="name"]', form).value.trim().length < 2) bad.push($('[name="name"]', form).closest('.field'));
        if (!/[\d\s+]{9,}/.test($('[name="tel"]', form).value)) bad.push($('[name="tel"]', form).closest('.field'));
        if (!$('[name="consent"]', form).checked) bad.push($('[name="consent"]', form).closest('.field'));
        bad.forEach(function (f) { f.classList.add('is-invalid'); });
        if (bad.length) { var first = $('input, textarea', bad[0]); if (first) first.focus(); return; }
        var btn = $('button[type="submit"]', form);
        btn.classList.add('is-loading');
        // Prototyp: v Laraveli POST /eventy/dopyt → Filament (Inquiries) + e-mail manažérovi
        setTimeout(function () { form.hidden = true; done.hidden = false; done.focus(); }, 900);
      });
    });
  }

  /* ------------------------------------------- mobil: priebeh galérie */
  function initMainsScrollProgress() {
    var track = $('[data-mains-track]');
    var bar = $('[data-mains-progress]');
    if (!track || !bar) return;
    function upd() {
      var max = track.scrollWidth - track.clientWidth;
      var p = max > 0 ? track.scrollLeft / max : 0;
      bar.style.transform = 'scaleX(' + (0.16 + p * 0.84).toFixed(3) + ')';
    }
    track.addEventListener('scroll', upd, { passive: true });
    upd();
  }

  /* ================================================================ POHYB */
  function initMotion() {
    if (!root.classList.contains('has-motion') || !window.gsap || !window.ScrollTrigger) {
      root.classList.remove('has-motion');
      return false;
    }
    clearTimeout(window.__motionFallback);
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    if (page === 'index' && !location.hash) window.scrollTo(0, 0);
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    gsap.defaults({ ease: 'expo.out' });

    if (window.Lenis) {
      lenis = new Lenis({ lerp: 0.11, smoothWheel: true, wheelMultiplier: 0.95 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    // anchor odkazy cez Lenis
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute('href').length < 2) return;
      var target = document.getElementById(a.getAttribute('href').slice(1));
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.6 });
      else target.scrollIntoView({ behavior: 'smooth' });
      history.replaceState(null, '', a.getAttribute('href'));
    });

    // odhalenia
    $$('[data-reveal]').forEach(function (el) {
      gsap.to(el, { opacity: 1, y: 0, duration: 1.2, scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });
    $$('[data-curtain]').forEach(function (el) {
      var img = $('img', el);
      var tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
      tl.to(el, { clipPath: 'inset(0% 0 0 0)', duration: 1.5, ease: 'expo.inOut' });
      if (img) tl.to(img, { scale: 1, duration: 1.9, ease: 'expo.out' }, 0.1);
    });
    $$('[data-parallax]').forEach(function (el) {
      gsap.fromTo(el, { y: 40 }, { y: -40, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    $$('[data-zoom] img').forEach(function (img) {
      gsap.fromTo(img, { scale: 1.18 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // podstránky: hero obrázok
    $$('[data-hero-in]').forEach(function (el) {
      gsap.fromTo(el, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.6, ease: 'expo.inOut', delay: 0.15 });
      var img = $('img', el);
      if (img) gsap.fromTo(img, { scale: 1.2 }, { scale: 1, duration: 2.2, ease: 'expo.out', delay: 0.15 });
    });
    $$('[data-title-in]').forEach(function (el) {
      gsap.fromTo(el, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4, delay: 0.25 });
    });
    return true;
  }

  /* ----------------------------------------------- domov: večer */
  function initHomeMotion() {
    var hero = $('.hero');
    if (!hero) return;
    var media = $('[data-door]', hero);
    var img = $('img', media);
    var copy = $('[data-hero-copy]', hero);
    var caption = $('[data-hero-caption]', hero);
    var scrim = $('[data-hero-scrim]', hero);

    // rám oblúka zostáva v layoute, médium sa stáva „dverami“
    var frame = document.createElement('div');
    frame.className = 'hero__frame';
    frame.setAttribute('aria-hidden', 'true');
    hero.insertBefore(frame, media);
    media.classList.add('is-door');

    function startClip() {
      var h = hero.getBoundingClientRect();
      var f = frame.getBoundingClientRect();
      var top = f.top - h.top, left = f.left - h.left;
      var right = h.right - f.right, bottom = h.bottom - f.bottom;
      var r = f.width / 2;
      return 'inset(' + top + 'px ' + right + 'px ' + bottom + 'px ' + left + 'px round ' + r + 'px ' + r + 'px 0px 0px)';
    }
    gsap.set(media, { clipPath: startClip() });

    // intro: monogram sa dokreslí
    var intro = $('[data-intro]');
    var seen = false;
    try { seen = sessionStorage.getItem('antoni-intro') === '1'; sessionStorage.setItem('antoni-intro', '1'); } catch (e) { seen = false; }
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    if (intro && !seen) {
      var strokes = $$('.stroke path', intro);
      strokes.forEach(function (p) {
        var len = p.getTotalLength();
        p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
      });
      tl.to(strokes, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.18 })
        .to($('.fill', intro), { opacity: 1, duration: 0.6, ease: 'power1.out' }, '-=0.55')
        .to($$('.stroke', intro), { opacity: 0, duration: 0.4 }, '<0.2')
        .to(intro, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, '+=0.15')
        .set(intro, { display: 'none' });
    } else if (intro) {
      intro.style.display = 'none';
    }
    tl.from(img, { scale: 1.3, duration: 2.2 }, intro && !seen ? '-=0.9' : 0)
      .from($$('.hero__time, .hero__title, .hero__sub, .hero__actions', copy), { y: 40, opacity: 0, duration: 1.3, stagger: 0.08 }, '<0.25');

    // scroll: oblúk sa otvára na celú plochu
    var door = gsap.timeline({
      scrollTrigger: {
        trigger: hero, start: 'top top', end: '+=85%', scrub: 0.6, pin: true, anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });
    door.fromTo(media, { clipPath: function () { return startClip(); } },
      { clipPath: 'inset(0px 0px 0px 0px round 0px 0px 0px 0px)', ease: 'power2.inOut', duration: 1 }, 0)
      .fromTo(img, { scale: 1.08 }, { scale: 1, ease: 'none', duration: 1 }, 0)
      .to(copy, { opacity: 0, y: -50, ease: 'power1.in', duration: 0.45 }, 0)
      .to(scrim, { opacity: 1, ease: 'none', duration: 0.6 }, 0.35)
      .fromTo(caption, { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.4 }, 0.6);


    // hlavný chod: horizontálna galéria (desktop)
    var mm = gsap.matchMedia();
    mm.add('(min-width: 1100px)', function () {
      var sec = $('.ch-mains');
      var track = $('[data-mains-track]');
      var prog = $('[data-mains-progress]');
      var hint = $('[data-mains-hint]');
      if (hint) hint.textContent = 'Scrollujte ďalej';
      function dist() { return Math.max(0, track.scrollWidth - track.clientWidth + 120); }
      var tw = gsap.to(track, {
        x: function () { return -dist(); }, ease: 'none',
        scrollTrigger: { trigger: sec, start: 'top top', end: function () { return '+=' + dist(); }, scrub: 0.8, pin: true, invalidateOnRefresh: true }
      });
      var pr = gsap.fromTo(prog, { scaleX: 0.16 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: function () { return '+=' + dist(); }, scrub: true } });
      return function () { tw.kill(); pr.kill(); gsap.set(track, { x: 0 }); };
    });

    // spoločný stôl sa pomaly otáča
    var tableImg = $('[data-table-img]');
    if (tableImg) {
      gsap.fromTo(tableImg, { rotate: -14, scale: 1.08 }, {
        rotate: 10, scale: 1, ease: 'none',
        scrollTrigger: { trigger: '[data-table]', start: 'top bottom', end: 'bottom top', scrub: true }
      });
    }

    // kačacie hody: pás fotiek sa jemne posúva (mobil)
    mm.add('(max-width: 899px)', function () {
      var strip = $('[data-strip]');
      if (!strip) return;
      var t = gsap.fromTo(strip, { x: 60 }, { x: -20, ease: 'none', scrollTrigger: { trigger: strip, start: 'top bottom', end: 'bottom top', scrub: true } });
      return function () { t.kill(); };
    });

    // kapitoly: hodiny, tón, os — vytvorené až po všetkých pinoch, aby sedeli pozície
    $$('[data-chapter]').forEach(function (ch) {
      ScrollTrigger.create({
        trigger: ch, start: 'top 38%', end: 'bottom 38%', refreshPriority: -1,
        onToggle: function (self) { if (self.isActive) setChapter(ch); }
      });
    });
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  /* ================================================================ štart */
  function boot() {
    openStatus();
    setInterval(openStatus, 60000);
    todayPill();
    initSheets();
    initDrawer();
    initHeader();
    initDishes();
    initCatnav();
    initWeek();
    initClock();
    initReserve();
    initInquiry();
    initMainsScrollProgress();
    $$('[data-today-open]').forEach(function (a) { a.addEventListener('click', openTodaySheet); });

    var motion = false;
    try {
      motion = initMotion();
      if (motion && page === 'index') initHomeMotion();
    } catch (err) {
      // poistka: pri chybe animácií ukážeme obsah bez pohybu
      if (window.console) console.warn('Antoni motion fallback:', err);
      if (window.ScrollTrigger) ScrollTrigger.getAll().forEach(function (t) { t.kill(); });
      if (window.gsap) gsap.set('[data-reveal], [data-curtain], [data-curtain] img, .hero__media, .hero__media img, .intro', { clearProps: 'all' });
      var intro = $('[data-intro]'); if (intro) intro.style.display = 'none';
      root.classList.remove('has-motion');
      motion = false;
    }
    if (!motion || page !== 'index') initChaptersStatic();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

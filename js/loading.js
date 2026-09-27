/**
 * OSON PRAVA — Loading (minimal)
 *
 * 1) Sayt preloader'i (#site-preloader)
 *    - Hech qanday tashqi resursni (CDN, shrift, ikonka) kutmaydi.
 *    - Eng kamida MIN_VISIBLE ms ko‘rinadi (chaqnab o‘tib ketmasligi uchun),
 *      eng ko‘pi bilan MAX_VISIBLE ms — undan keyin nima bo‘lishidan qat’i nazar yopiladi.
 *    - Qo‘shimcha kafolat: <head> dagi CSS-failsafe JS umuman ishlamasa ham 7 soniyada yopadi.
 *
 * 2) Amallar orasidagi yengil overlay (#global-action-loader): show / hide / run.
 *
 * Tashqi API o‘zgarmagan: OSON_LOADING.show / hide / run / replay / completePreloader
 */

window.OSON_LOADING = (function () {
  'use strict';

  var MIN_VISIBLE = 900;   // ms — preloader kamida shuncha ko‘rinadi (emblema animatsiyasi tugashi uchun)
  var MAX_VISIBLE = 2600;  // ms — hech qachon bundan ko‘p kutmaydi
  var FADE_MS = 520;       // CSS transition (.5s) bilan mos

  var progress = 0;
  var startedAt = 0;
  var ready = false;
  var done = false;
  var ticker = null;
  var timers = [];

  function $(id) { return document.getElementById(id); }

  function later(fn, ms) {
    var id = setTimeout(fn, ms);
    timers.push(id);
    return id;
  }

  function clearAll() {
    clearInterval(ticker);
    ticker = null;
    for (var i = 0; i < timers.length; i++) clearTimeout(timers[i]);
    timers = [];
  }

  function render(value) {
    var v = Math.min(Math.max(value, 0), 100);
    var bar = $('preloader-progress-bar');
    var pct = $('preloader-percent');
    if (bar) bar.style.transform = 'scaleX(' + (v / 100) + ')';
    if (pct) pct.textContent = Math.round(v) + '%';
  }

  function setMessage(text) {
    var msg = $('preloader-msg');
    if (msg && msg.textContent !== text) msg.textContent = text;
  }

  // Vaqtga qarab 90% gacha silliq o‘sadi; tayyor bo‘lgach 100% ga yetadi.
  function tick() {
    if (done) return;
    var elapsed = performance.now() - startedAt;
    var target = ready ? 100 : 90 * (1 - Math.exp(-elapsed / 650));
    progress += (target - progress) * (ready ? 0.3 : 0.14);
    if (ready && progress > 99.2) progress = 100;
    render(progress);
    if (progress >= 100) finish();
  }

  function markReady(force) {
    if (ready || done) return;
    var wait = force ? 0 : Math.max(0, MIN_VISIBLE - (performance.now() - startedAt));
    later(function () { ready = true; }, wait);
  }

  function finish() {
    if (done) return;
    done = true;
    clearAll();
    render(100);
    setMessage('Tayyor');
    var el = $('site-preloader');
    if (!el) return;

    setTimeout(function () {
      el.classList.add('is-hidden');
      setTimeout(function () {
        el.style.display = 'none';
        try {
          if (typeof window.unlockBodyScroll === 'function') window.unlockBodyScroll(true);
        } catch (e) { /* e’tiborsiz */ }
      }, FADE_MS);
    }, 160);
  }

  function start() {
    var el = $('site-preloader');
    if (!el) return;

    clearAll();
    done = false;
    ready = false;
    progress = 0;
    startedAt = performance.now();
    render(0);
    setMessage('Yuklanmoqda');

    // setInterval (rAF emas): fon tabda ham to‘xtab qolmaydi
    ticker = setInterval(tick, 40);

    // Sahifa to‘liq yuklanganda tayyor
    if (document.readyState === 'complete') {
      markReady(false);
    } else {
      window.addEventListener('load', function () { markReady(false); }, { once: true });
    }

    // Qattiq chegara: nima bo‘lsa ham MAX_VISIBLE da tayyor deb hisoblaymiz
    later(function () { markReady(true); }, MAX_VISIBLE);
    // Oxirgi kafolat: ticker biror sabab bilan yurmasa ham yopamiz
    later(finish, MAX_VISIBLE + 1200);
  }

  function completePreloader() {
    finish();
  }

  // Demo / test uchun qayta ko‘rsatish
  function replay() {
    var el = $('site-preloader');
    if (!el) return;
    el.style.animation = 'none';       // CSS-failsafe qayta ishga tushmasin
    el.style.display = 'flex';
    el.classList.remove('is-hidden');
    start();
  }

  // ---- Amallar orasidagi overlay -------------------------------------------
  var runToken = 0;

  function show(title, subtitle) {
    var loader = $('global-action-loader');
    if (!loader) return;
    var t = $('action-loader-title');
    var s = $('action-loader-sub');
    if (t) t.textContent = title || 'Yuklanmoqda...';
    if (s) s.textContent = subtitle || 'Biroz kuting...';
    loader.classList.add('is-open');
  }

  function hide() {
    var loader = $('global-action-loader');
    if (loader) loader.classList.remove('is-open');
  }

  function run(duration, title, subtitle, callback) {
    var token = ++runToken;
    show(title, subtitle);
    setTimeout(function () {
      if (token === runToken) hide();      // yangiroq run() ni o‘chirib yubormaslik uchun
      if (typeof callback === 'function') callback();
    }, typeof duration === 'number' ? duration : 750);
  }

  // Avtomatik ishga tushirish
  start();

  return {
    show: show,
    hide: hide,
    run: run,
    replay: replay,
    completePreloader: completePreloader
  };
})();

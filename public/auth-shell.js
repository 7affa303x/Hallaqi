/**
 * Early auth/host guards — must stay a standalone file (CSP blocks inline scripts).
 * Loaded before the app bundle so OAuth returns never remount a stale SW shell.
 */
(function () {
  try {
    if (location.hostname === 'www.hallaqi.app') {
      location.replace('https://hallaqi.app' + location.pathname + location.search + location.hash);
      return;
    }

    var q = location.search || '';
    var h = location.hash || '';
    var auth = /[?&]code=/.test(q) || /[?&]error=/.test(q) || /access_token=/.test(h) || /type=recovery/.test(h);
    if (!auth) return;

    var codeMatch = q.match(/[?&]code=([^&]+)/);
    var refreshKey = 'hallaqi-auth-shell-refreshed:' + (codeMatch ? codeMatch[1].slice(0, 24) : 'err');
    if (sessionStorage.getItem(refreshKey) === '1') return;
    sessionStorage.setItem(refreshKey, '1');

    window.__HALLAQI_AUTH_SHELL_PENDING = true;
    var reload = function () {
      var u = new URL(location.href);
      u.searchParams.set('hallaqi_refresh', 'oauth');
      location.replace(u.pathname + u.search + u.hash);
    };
    var tasks = [];
    if (window.caches) {
      tasks.push(caches.keys().then(function (keys) {
        return Promise.all(keys.map(function (k) { return caches.delete(k); }));
      }));
    }
    if (navigator.serviceWorker) {
      tasks.push(navigator.serviceWorker.getRegistrations().then(function (regs) {
        return Promise.all(regs.map(function (r) { return r.unregister(); }));
      }));
    }
    if (tasks.length) Promise.all(tasks).then(reload, reload);
    else reload();
  } catch (e) { /* ignore */ }
})();

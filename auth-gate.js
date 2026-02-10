(function () {
  var HASH = 'ade5a4430f6f2c0b47f9b801800bb6dcf0441da83bcbe210589d83ca7c0e141e';

  async function sha256(text) {
    var data = new TextEncoder().encode(text);
    var buf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
  }

  if (sessionStorage.getItem('af_auth') === 'ok') return;

  // Hide page content
  document.documentElement.style.visibility = 'hidden';

  // Build overlay
  var overlay = document.createElement('div');
  overlay.id = 'af-auth-overlay';
  overlay.innerHTML =
    '<div style="position:fixed;inset:0;z-index:99999;background:#f5f3ef;display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif">' +
      '<div style="background:#fff;border:1px solid #ddd;border-radius:12px;padding:40px;max-width:360px;width:90%;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,.08)">' +
        '<div style="font-size:24px;font-weight:700;color:#1a2e1a;margin-bottom:8px">Ambient Finance</div>' +
        '<p style="color:#64748b;font-size:14px;margin-bottom:24px">Enter the password to continue</p>' +
        '<input id="af-auth-input" type="password" placeholder="Password" style="width:100%;padding:10px 14px;border:1px solid #d4d0c8;border-radius:8px;font-size:15px;box-sizing:border-box;outline:none;margin-bottom:12px" />' +
        '<button id="af-auth-btn" style="width:100%;padding:10px;background:#2d6a4f;color:#fff;border:none;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer">Enter</button>' +
        '<p id="af-auth-err" style="color:#c0392b;font-size:13px;margin-top:12px;display:none">Incorrect password</p>' +
      '</div>' +
    '</div>';

  document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(overlay);
    document.documentElement.style.visibility = 'visible';

    var input = document.getElementById('af-auth-input');
    var btn = document.getElementById('af-auth-btn');
    var err = document.getElementById('af-auth-err');

    async function tryAuth() {
      var hash = await sha256(input.value);
      if (hash === HASH) {
        sessionStorage.setItem('af_auth', 'ok');
        overlay.remove();
      } else {
        err.style.display = 'block';
        input.value = '';
        input.focus();
      }
    }

    btn.addEventListener('click', tryAuth);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') tryAuth();
    });

    input.focus();
  });
})();

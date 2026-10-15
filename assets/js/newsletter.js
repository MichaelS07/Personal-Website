/* The Signal — newsletter signup.
   - Wires up any <form data-newsletter> on the page.
   - On pages without one (blog index, every blog post), injects a signup block above the footer.
   - Pushes `newsletter_signup` to the dataLayer so GTM/GA4 can count it as a conversion.

   PROVIDER: signups currently go to FormSubmit (emails you each new subscriber).
   To send them straight into a real list instead, change ENDPOINT + buildBody below, e.g.
     Kit (ConvertKit):  https://app.kit.com/forms/<FORM_ID>/subscriptions   body: email_address=<email>
     Beehiiv:           use their embed form URL, or a Zapier/Make webhook that calls their API
   Keep the success handling and dataLayer push as they are. */
(function () {
  var ENDPOINT = 'https://formsubmit.co/ajax/michaelsowden17@gmail.com';

  function buildBody(email, source) {
    return JSON.stringify({
      email: email,
      source: source,
      page: location.pathname,
      _subject: 'New Signal subscriber',
      _template: 'table'
    });
  }

  function track(source) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'newsletter_signup', newsletter_name: 'the_signal', newsletter_source: source });
  }

  function wire(form) {
    if (form.dataset.nlWired) return;
    form.dataset.nlWired = '1';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var honey = form.querySelector('[name="_honey"]');
      if (honey && honey.value) return; // bot
      var input = form.querySelector('input[type="email"]');
      var btn = form.querySelector('button');
      var source = form.dataset.source || 'site';
      if (!input || !input.value) return;
      if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = 'Subscribing…'; }

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: buildBody(input.value, source)
      }).then(function (r) {
        if (!r.ok) throw new Error('status ' + r.status);
        form.classList.add('is-done');
        track(source);
      }).catch(function () {
        if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || 'Subscribe'; }
        alert('That didn\'t go through. Please try again, or email michaelsowden17@gmail.com.');
      });
    });
  }

  var CSS = '' +
    '.sig{max-width:1120px;margin:56px auto;padding:0 24px;font-family:Inter,system-ui,sans-serif}' +
    '.sig-in{position:relative;overflow:hidden;border-radius:22px;padding:40px;color:#fff;display:grid;grid-template-columns:1.2fr 1fr;gap:28px;align-items:center;' +
      'background:radial-gradient(70% 90% at 100% 0%,rgba(16,185,129,.45),transparent 60%),#0b1611;' +
      'box-shadow:0 2px 4px rgba(11,15,13,.05),0 24px 48px -12px rgba(11,15,13,.22),0 60px 100px -30px rgba(11,15,13,.25)}' +
    '.sig-k{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#34d399;font-weight:600}' +
    '.sig h2{font-family:"Space Grotesk",sans-serif;font-size:28px;line-height:1.1;letter-spacing:-.02em;margin:10px 0 10px;color:#fff!important;font-weight:700}' +
    '.sig p{color:rgba(255,255,255,.7)!important;font-size:15px;line-height:1.55;margin:0}' +
    '.sig form{display:flex;gap:10px;flex-wrap:wrap}' +
    '.sig input[type=email]{flex:1 1 200px;font:inherit;font-size:15px;color:#fff;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.16);border-radius:11px;padding:13px 15px;outline:none}' +
    '.sig input[type=email]::placeholder{color:rgba(255,255,255,.45)}' +
    '.sig input[type=email]:focus{border-color:#34d399;box-shadow:0 0 0 3px rgba(52,211,153,.25)}' +
    '.sig button{font:inherit;font-weight:600;font-size:14.5px;color:#fff;border:0;border-radius:11px;padding:13px 20px;cursor:pointer;' +
      'background:linear-gradient(180deg,#22c58f,#0e9f6e);box-shadow:inset 0 1px 0 rgba(255,255,255,.25),0 8px 20px -6px rgba(16,185,129,.6)}' +
    '.sig .hp{position:absolute;left:-9999px}' +
    '.sig .fine{font-size:12.5px;color:rgba(255,255,255,.5);margin-top:10px}' +
    '.sig .done{display:none;color:#6ee7b7;font-weight:500}' +
    '.sig form.is-done{display:none}.sig form.is-done~.done{display:block}' +
    '@media(max-width:760px){.sig-in{grid-template-columns:1fr;padding:30px 22px}}';

  function inject() {
    var footer = document.querySelector('footer');
    if (!footer) return;
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var isPost = /\/blog-posts\//.test(location.pathname);
    var box = document.createElement('section');
    box.className = 'sig';
    box.id = 'newsletter';
    box.innerHTML =
      '<div class="sig-in">' +
        '<div><div class="sig-k">The Signal · weekly</div>' +
        '<h2>' + (isPost ? 'Get the next one in your inbox.' : 'Get every post as a 4-minute email.') + '</h2>' +
        '<p>Every Monday, one change in search, paid or email, and the exact thing I\'d do about it.</p></div>' +
        '<div><form data-newsletter data-source="' + (isPost ? 'post_footer' : 'blog_index') + '">' +
          '<input type="email" name="email" required placeholder="you@store.com" aria-label="Email address" autocomplete="email">' +
          '<input type="text" name="_honey" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">' +
          '<button type="submit">Subscribe free →</button>' +
        '</form>' +
        '<p class="done" role="status">You\'re in. First issue lands Monday.</p>' +
        '<p class="fine">Free, and one click to unsubscribe.</p></div>' +
      '</div>';
    footer.parentNode.insertBefore(box, footer);
  }

  function init() {
    if (!document.querySelector('form[data-newsletter]')) inject();
    document.querySelectorAll('form[data-newsletter]').forEach(wire);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

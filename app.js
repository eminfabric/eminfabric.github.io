(function () {
  var S = window.SHOP, P = window.PRODUCTS;

  /* ---------- i18n ---------- */
  var UI = {
    ru: {
      shop: "Ала-Тоо · A2/1-22", city: "бывш. Мадина · Бишкек",
      t1: "Оптом", t2: "Премиум ткани", t3: "Рынок Ала-Тоо (бывш. Мадина), A2/1-22",
      code: "Код", order: "Заказать", openwa: "Открыть в каталоге WhatsApp ↗",
      soon: "фото скоро", addr: "Ала-Тоо (Мадина), блок А, A2/1-22", orderAria: "Заказать в WhatsApp",
      hello: "Здравствуйте! Пишу с сайта.",
      msg: function (t, code, n) { return "Здравствуйте! Ткань оптом: " + t + ", код " + code + " (№" + n + "). Рулонов: "; },
      title: "Ткани оптом · Ала-Тоо A2/1-22"
    },
    en: {
      shop: "Ala-Too · A2/1-22", city: "ex-Madina · Bishkek",
      t1: "Wholesale", t2: "Premium fabrics", t3: "Ala-Too Market (ex-Madina), A2/1-22",
      code: "Code", order: "Order", openwa: "Open in WhatsApp catalog ↗",
      soon: "photo soon", addr: "Ala-Too Market, Block A, A2/1-22", orderAria: "Order on WhatsApp",
      hello: "Hello! I'm writing from your website.",
      msg: function (t, code, n) { return "Hello! Wholesale fabric: " + t + ", code " + code + " (No. " + n + "). Rolls: "; },
      title: "Wholesale fabrics · Ala-Too A2/1-22"
    }
  };
  // product words (RU in products.js -> EN)
  var EN = {
    "Жаккард": "Jacquard", "Жаккард 26": "Jacquard 26", "Жаккард 8817": "Jacquard 8817", "Жаккард 8804": "Jacquard 8804",
    "Хлопок (Х/Б)": "Cotton", "Стрейч": "Stretch",
    "100% Х/Б": "100% Cotton", "Х/Б без стрейча": "Cotton, non-stretch", "Х/Б стрейч": "Stretch cotton",
    "Х/Б 100%": "CO-100", "Х/Б": "Cotton",
    "цветной набор": "multicolour set", "серый": "grey", "чёрный": "black", "серебристый": "silver",
    "коричневый": "brown", "зелёный": "green", "голубой": "light blue", "оливковый": "olive",
    "тёмно-зелёный": "dark green", "тёмно-синий": "navy",
    "Стрейч хлопок-лён, лёгкий и дышащий": "Stretch cotton-linen, light and breathable"
  };

  var CIS = /^(ru|ky|kk|uz|uk|be|tg|tk|az|hy|ka)\b/i;
  function detect() {
    var q = new URLSearchParams(location.search).get("lang");
    if (q === "ru" || q === "en") return q;
    try { var s = localStorage.getItem("lang"); if (s === "ru" || s === "en") return s; } catch (e) {}
    var langs = navigator.languages || [navigator.language || "ru"];
    for (var i = 0; i < langs.length; i++) { if (CIS.test(langs[i])) return "ru"; }
    return "en";
  }
  var lang = detect();
  function L() { return UI[lang]; }
  function tr(s) { return lang === "en" && s ? (EN[s] || s) : s; }

  /* ---------- helpers ---------- */
  function wa(n, t) { return "https://wa.me/" + n + (t ? "?text=" + encodeURIComponent(t) : ""); }
  function each(s, f) { document.querySelectorAll(s).forEach(f); }
  function fmt(n) { return "+" + n.slice(0, 3) + " " + n.slice(3, 6) + " " + n.slice(6, 9) + " " + n.slice(9); }
  function ext(a) { a.target = "_blank"; a.rel = "noopener"; }
  function title(p) { return tr(p.name) + (p.color ? ", " + tr(p.color) : ""); }
  function code(p) { return tr(p.code); }
  function orderMsg(p) { return L().msg(title(p), code(p), p.n); }
  function slug(s) { return "c-" + s.toLowerCase().replace(/[^a-zа-яё0-9]+/gi, "-"); }

  each("[data-tel]", function (a) { a.href = "tel:" + S.phone; });
  each("[data-ig]", function (a) { a.href = "https://instagram.com/" + S.instagram; });
  each("[data-wa-label]", function (e) { e.textContent = fmt(S.whatsapp); });
  each("[data-wa2-label]", function (e) { e.textContent = fmt(S.whatsapp2); });
  each("[data-tel-label]", function (e) { e.textContent = S.phoneLabel; });
  each("[data-ig-label]", function (e) { e.textContent = "@" + S.instagram; });

  /* ---------- catalog ---------- */
  var groups = [];
  P.forEach(function (p) {
    var g = groups.find(function (x) { return x.name === p.collection; });
    if (!g) groups.push(g = { name: p.collection, items: [] });
    g.items.push(p);
  });
  var tabs = document.getElementById("tabs"), wrap = document.getElementById("sections");

  function build(animate) {
    tabs.innerHTML = ""; wrap.innerHTML = "";
    groups.forEach(function (g) {
      var id = slug(g.name);
      var t = document.createElement("a"); t.href = "#" + id; t.textContent = tr(g.name); t.dataset.id = id; tabs.appendChild(t);
      var sec = document.createElement("section"); sec.className = "sec"; sec.id = id;
      sec.innerHTML = '<div class="sec__head"><h2>' + tr(g.name) + '</h2><span class="sec__count">' + g.items.length + '</span></div><ul class="grid"></ul>';
      var ul = sec.querySelector(".grid");
      g.items.forEach(function (p, i) {
        var li = document.createElement("li");
        li.className = "card" + (animate ? "" : " in"); li.tabIndex = 0; li.style.transitionDelay = (i % 4) * 70 + "ms";
        li.dataset.idx = P.indexOf(p);
        li.innerHTML = (p.img ? '<img loading="lazy" src="' + p.img + '" alt="' + title(p) + ' ' + code(p) + '">' : '<div class="ph"><span>' + L().soon + '</span></div>') +
          '<div class="card__cap"><div><h3>' + title(p) + '</h3><p>' + code(p) + '</p></div>' +
          '<a class="card__go" target="_blank" rel="noopener" aria-label="' + L().orderAria + '" href="' + wa(S.whatsapp, orderMsg(p)) + '"><svg viewBox="0 0 24 24"><use href="#wa"/></svg></a></div>';
        ul.appendChild(li);
      });
      wrap.appendChild(sec);
    });
    pending = animate ? [].slice.call(document.querySelectorAll(".card")) : [];
    each(".sec", function (s) { if (spy) spy.observe(s); });
  }

  function applyLang() {
    document.documentElement.lang = lang;
    document.title = L().title;
    each("[data-i18n]", function (e) { var v = L()[e.getAttribute("data-i18n")]; if (typeof v === "string") e.textContent = v; });
    each("[data-addr]", function (e) { e.textContent = L().addr; });
    each("[data-wa]", function (a) { a.href = wa(S.whatsapp, L().hello); ext(a); });
    each("[data-wa2]", function (a) { a.href = wa(S.whatsapp2, L().hello); ext(a); });
    each("[data-lang]", function (b) { b.classList.toggle("is-on", b.getAttribute("data-lang") === lang); b.setAttribute("aria-pressed", b.getAttribute("data-lang") === lang); });
  }

  /* ---------- reveal on scroll ---------- */
  document.documentElement.classList.add("reveal");
  var pending = [], ticking = false, spy = null;
  function reveal() {
    var h = window.innerHeight || 800;
    pending = pending.filter(function (c) {
      if (c.getBoundingClientRect().top < h * 0.96) { c.classList.add("in"); return false; }
      return true;
    });
    ticking = false;
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(reveal); } }, { passive: true });
  window.addEventListener("resize", reveal);

  /* ---------- active tab ---------- */
  if ("IntersectionObserver" in window) {
    spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        each(".tabs a", function (a) { a.classList.toggle("is-on", a.dataset.id === e.target.id); });
        var on = tabs.querySelector(".is-on"); if (on) on.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
  }

  applyLang();
  build(true);
  reveal(); setTimeout(reveal, 300);
  // safety: never leave products hidden (fast scroll, screenshots, old browsers)
  setTimeout(function () { pending.forEach(function (c) { c.classList.add("in"); }); pending = []; }, 2500);

  each("[data-lang]", function (b) {
    b.addEventListener("click", function () {
      var next = b.getAttribute("data-lang");
      if (next === lang) return;
      lang = next;
      try { localStorage.setItem("lang", lang); } catch (e) {}
      applyLang(); build(false);
      if (!sheet.hidden) show(cur);
    });
  });

  /* ---------- product sheet ---------- */
  var sheet = document.getElementById("sheet"), cur = 0;
  function show(i) {
    cur = (i + P.length) % P.length; var p = P[cur];
    document.getElementById("sh-media").innerHTML = p.img ? '<img src="' + p.img + '" alt="' + title(p) + ' ' + code(p) + '">' : '<div class="ph"><span>' + L().soon + '</span></div>';
    document.getElementById("sh-col").textContent = tr(p.collection) + " · №" + p.n;
    document.getElementById("sh-title").textContent = title(p);
    document.getElementById("sh-code").textContent = code(p);
    document.getElementById("sh-order").href = wa(S.whatsapp, orderMsg(p));
    var w = document.getElementById("sh-wa"); w.hidden = !p.wa; if (p.wa) w.href = p.wa;
  }
  function open(i) { show(i); sheet.hidden = false; document.body.style.overflow = "hidden"; }
  function close() { sheet.hidden = true; document.body.style.overflow = ""; }
  wrap.addEventListener("click", function (e) {
    if (e.target.closest(".card__go")) return;
    var c = e.target.closest(".card"); if (c) open(+c.dataset.idx);
  });
  wrap.addEventListener("keydown", function (e) { var c = e.target.closest(".card"); if (c && e.key === "Enter") open(+c.dataset.idx); });
  each("[data-close]", function (b) { b.addEventListener("click", close); });
  document.getElementById("sh-prev").onclick = function () { show(cur - 1); };
  document.getElementById("sh-next").onclick = function () { show(cur + 1); };
  document.addEventListener("keydown", function (e) {
    if (sheet.hidden) return;
    if (e.key === "Escape") close(); if (e.key === "ArrowLeft") show(cur - 1); if (e.key === "ArrowRight") show(cur + 1);
  });
  var x0 = null;
  sheet.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  sheet.addEventListener("touchend", function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1)); x0 = null; });
})();

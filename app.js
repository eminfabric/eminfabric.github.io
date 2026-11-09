(function () {
  var S = window.SHOP, P = window.PRODUCTS;
  var hello = "Здравствуйте! Пишу с сайта.";
  function wa(n, t) { return "https://wa.me/" + n + (t ? "?text=" + encodeURIComponent(t) : ""); }
  function each(s, f) { document.querySelectorAll(s).forEach(f); }
  function fmt(n) { return "+" + n.slice(0, 3) + " " + n.slice(3, 6) + " " + n.slice(6, 9) + " " + n.slice(9); }
  function ext(a) { a.target = "_blank"; a.rel = "noopener"; }
  function title(p) { return p.name + (p.color ? ", " + p.color : ""); }
  function orderMsg(p) { return "Здравствуйте! Ткань оптом: " + title(p) + ", код " + p.code + " (№" + p.n + "). Рулонов: "; }
  function slug(s) { return "c-" + s.toLowerCase().replace(/[^a-zа-яё0-9]+/gi, "-"); }

  each("[data-wa]", function (a) { a.href = wa(S.whatsapp, hello); ext(a); });
  each("[data-wa2]", function (a) { a.href = wa(S.whatsapp2, hello); ext(a); });
  each("[data-tel]", function (a) { a.href = "tel:" + S.phone; });
  each("[data-ig]", function (a) { a.href = "https://instagram.com/" + S.instagram; });
  each("[data-wa-label]", function (e) { e.textContent = fmt(S.whatsapp); });
  each("[data-wa2-label]", function (e) { e.textContent = fmt(S.whatsapp2); });
  each("[data-tel-label]", function (e) { e.textContent = S.phoneLabel; });
  each("[data-ig-label]", function (e) { e.textContent = "@" + S.instagram; });
  each("[data-addr]", function (e) { e.textContent = "Мадина, Новый Север-22"; });

  // group by collection, keep order
  var groups = [];
  P.forEach(function (p) {
    var g = groups.find(function (x) { return x.name === p.collection; });
    if (!g) groups.push(g = { name: p.collection, items: [] });
    g.items.push(p);
  });

  var tabs = document.getElementById("tabs"), wrap = document.getElementById("sections");
  groups.forEach(function (g) {
    var id = slug(g.name);
    var t = document.createElement("a"); t.href = "#" + id; t.textContent = g.name; t.dataset.id = id; tabs.appendChild(t);
    var sec = document.createElement("section"); sec.className = "sec"; sec.id = id;
    sec.innerHTML = '<div class="sec__head"><h2>' + g.name + '</h2><span class="sec__count">' + g.items.length + '</span></div><ul class="grid"></ul>';
    var ul = sec.querySelector(".grid");
    g.items.forEach(function (p, i) {
      var li = document.createElement("li");
      li.className = "card"; li.tabIndex = 0; li.style.transitionDelay = (i % 4) * 70 + "ms";
      li.dataset.idx = P.indexOf(p);
      li.innerHTML = (p.img ? '<img loading="lazy" src="' + p.img + '" alt="' + p.name + ' ' + p.code + '">' : '<div class="ph"><span>фото скоро</span></div>') +
        '<div class="card__cap"><div><h3>' + title(p) + '</h3><p>' + p.code + '</p></div>' +
        '<a class="card__go" target="_blank" rel="noopener" aria-label="Заказать в WhatsApp" href="' + wa(S.whatsapp, orderMsg(p)) + '"><svg viewBox="0 0 24 24"><use href="#wa"/></svg></a></div>';
      ul.appendChild(li);
    });
    wrap.appendChild(sec);
  });

  // reveal on scroll (no IntersectionObserver: works everywhere)
  document.documentElement.classList.add("reveal");
  var pending = [].slice.call(document.querySelectorAll(".card")), ticking = false;
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
  reveal(); setTimeout(reveal, 300);
  // safety: never leave products hidden (fast scroll, screenshots, old browsers)
  setTimeout(function () { pending.forEach(function (c) { c.classList.add("in"); }); pending = []; }, 2500);

  // active tab
  var spy = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      each(".tabs a", function (a) { a.classList.toggle("is-on", a.dataset.id === e.target.id); });
      var on = tabs.querySelector(".is-on"); if (on) on.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  each(".sec", function (s) { spy.observe(s); });

  // product sheet
  var sheet = document.getElementById("sheet"), cur = 0;
  function show(i) {
    cur = (i + P.length) % P.length; var p = P[cur];
    document.getElementById("sh-media").innerHTML = p.img ? '<img src="' + p.img + '" alt="' + p.name + ' ' + p.code + '">' : '<div class="ph"><span>фото скоро</span></div>';
    document.getElementById("sh-col").textContent = p.collection + " · №" + p.n;
    document.getElementById("sh-title").textContent = title(p);
    document.getElementById("sh-code").textContent = p.code;
    document.getElementById("sh-order").href = wa(S.whatsapp, orderMsg(p));
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

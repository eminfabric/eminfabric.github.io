(function () {
  var S = window.SHOP, P = window.PRODUCTS;
  var hello = "Здравствуйте! Пишу с сайта.";

  function wa(num, text) {
    return "https://wa.me/" + num + (text ? "?text=" + encodeURIComponent(text) : "");
  }
  function each(sel, fn) { document.querySelectorAll(sel).forEach(fn); }
  function fmt(num) { // 996502982798 -> +996 502 982 798
    return "+" + num.slice(0, 3) + " " + num.slice(3, 6) + " " + num.slice(6, 9) + " " + num.slice(9);
  }

  each("[data-wa]", function (a) { a.href = wa(S.whatsapp, hello); a.target = "_blank"; a.rel = "noopener"; });
  each("[data-wa2]", function (a) { a.href = wa(S.whatsapp2, hello); a.target = "_blank"; a.rel = "noopener"; });
  each("[data-catalog]", function (a) { a.href = S.catalog; a.target = "_blank"; a.rel = "noopener"; });
  each("[data-tel]", function (a) { a.href = "tel:" + S.phone; });
  each("[data-ig]", function (a) { a.href = "https://instagram.com/" + S.instagram; });
  each("[data-wa-label]", function (e) { e.textContent = fmt(S.whatsapp); });
  each("[data-wa2-label]", function (e) { e.textContent = fmt(S.whatsapp2); });
  each("[data-tel-label]", function (e) { e.textContent = S.phoneLabel; });
  each("[data-ig-label]", function (e) { e.textContent = "@" + S.instagram; });
  each("[data-addr]", function (e) { e.textContent = S.address; });
  document.getElementById("y").textContent = new Date().getFullYear();

  var grid = document.getElementById("grid");
  function render(filter) {
    grid.innerHTML = "";
    P.filter(function (p) { return filter === "all" || p.group === filter; }).forEach(function (p) {
      var li = document.createElement("li");
      li.className = "card";
      var msg = "Здравствуйте! Интересует ткань: " + p.name + ", код " + p.code + " (№" + p.n + ").";
      var media = p.img
        ? '<img loading="lazy" src="' + p.img + '" alt="' + p.name + ', код ' + p.code + '">'
        : '<div class="ph" aria-hidden="true"><span>' + p.code + '</span><small>фото скоро</small></div>';
      li.innerHTML =
        '<div class="card__media">' + media + '<span class="card__n">№' + p.n + '</span></div>' +
        '<div class="card__body">' +
          '<p class="card__col">' + p.collection + '</p>' +
          '<h3>' + p.name + '</h3>' +
          '<p class="card__code">Код: <b>' + p.code + '</b></p>' +
          (p.note ? '<p class="card__note">' + p.note + '</p>' : '') +
          '<a class="btn btn--wa btn--block" target="_blank" rel="noopener" href="' + wa(S.whatsapp, msg) + '">Заказать<span class="hide-sm">&nbsp;в WhatsApp</span></a>' +
        '</div>';
      grid.appendChild(li);
    });
  }
  render("all");

  each(".chip", function (b) {
    b.addEventListener("click", function () {
      each(".chip", function (c) { c.classList.remove("is-on"); });
      b.classList.add("is-on");
      render(b.getAttribute("data-f"));
    });
  });
})();

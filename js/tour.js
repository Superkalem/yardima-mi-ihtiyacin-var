// Ana sayfada Garajım tanıtım turu. Ekran kararır, sırayla hedefler ışıkla vurgulanır ve
// yanlarında açıklama kartı çıkar. Kullanıcı turu bitirene ya da Garajım'a girene kadar
// her ziyarette gösterilir; "Atla" denirse o oturumda bir daha çıkmaz.
(function () {
  var DONE_KEY = "garajTuru";          // "tamam" ise bir daha gösterme (site.js de kullanır)
  var SKIP_KEY = "garajTuruAtlandi";   // bu oturumda atlandı
  try {
    if (localStorage.getItem(DONE_KEY) === "tamam" || sessionStorage.getItem(SKIP_KEY)) return;
  } catch (e) { return; }

  var STEPS = [
    {
      target: "#garageBtn",
      badge: "Yeni",
      title: "Garajım burada",
      text: "Araçlarını tek yerde topla. Garajına her zaman sağ üstteki bu butondan ulaşabilirsin.",
      round: true,
      pad: 6
    },
    {
      target: ".add-btn",
      title: "Önce aracını ekle",
      text: "+ ile aracını seç, uygun Shell yağını gör ve sonuç sayfasında “Garajıma ekle”ye bas.",
      round: true,
      pad: 8
    },
    {
      target: ".garage-band .btn",
      title: "Garajın seni hatırlatır",
      list: [
        "Yağ değişimine kalan km ve gün",
        "Antifriz değişim zamanı",
        "Muayene, sigorta ve kasko tarihleri",
        "Bakım geçmişi ve masraflar"
      ],
      scroll: true,
      round: true,
      pad: 6
    }
  ];

  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  var root, spot, card, step = 0, frame = 0;

  function build() {
    root = document.createElement("div");
    root.className = "tour";
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-labelledby", "tourTitle");
    root.innerHTML = '<div class="tour-spot"></div><div class="tour-card"></div>';
    document.body.appendChild(root);
    spot = root.querySelector(".tour-spot");
    card = root.querySelector(".tour-card");
    document.documentElement.classList.add("tour-lock");

    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, { passive: true });
    document.addEventListener("keydown", onKey);
    // Arka plan dokunuşla kaymasın.
    root.addEventListener("touchmove", function (e) { e.preventDefault(); }, { passive: false });

    requestAnimationFrame(function () { root.classList.add("open"); });
  }

  function onKey(e) {
    if (e.key === "Escape") close(false);
    if (e.key === "ArrowRight" || e.key === "Enter") next();
  }

  function schedule() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(position);
  }

  function show(n) {
    step = n;
    var s = STEPS[n];
    var last = n === STEPS.length - 1;
    var target = document.querySelector(s.target);

    if (s.scroll) {
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 84, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    card.innerHTML =
      (s.badge ? '<span class="tour-badge">' + s.badge + "</span>" : "") +
      '<h3 id="tourTitle">' + s.title + "</h3>" +
      (s.text ? "<p>" + s.text + "</p>" : "") +
      (s.list ? "<ul>" + s.list.map(function (t, i) {
        return '<li style="--i:' + i + '"><span>' + CHECK + "</span>" + t + "</li>";
      }).join("") + "</ul>" : "") +
      '<div class="tour-actions">' +
        '<button type="button" class="tour-skip">' + (last ? "Kapat" : "Atla") + "</button>" +
        '<div class="tour-dots">' + STEPS.map(function (_, i) { return '<span class="' + (i === n ? "on" : "") + '"></span>'; }).join("") + "</div>" +
        '<button type="button" class="btn btn-red btn-sm tour-next">' + (last ? "Garajıma git" : "İleri") + "</button>" +
      "</div>";

    card.querySelector(".tour-skip").addEventListener("click", function () { close(last); });
    card.querySelector(".tour-next").addEventListener("click", next);

    // Kart her adımda yeniden belirsin.
    card.classList.remove("in");
    void card.offsetWidth;
    card.classList.add("in");
    spot.classList.toggle("round", !!s.round);

    position();
    card.querySelector(".tour-next").focus({ preventScroll: true });
  }

  function next() {
    if (step < STEPS.length - 1) { show(step + 1); return; }
    close(true);
    ShellLoader.show();
    setTimeout(function () { location.href = "garaj.html"; }, 400);
  }

  // Işığı hedefin üstüne, kartı hedefin altına (sığmazsa üstüne) yerleştirir.
  function position() {
    var s = STEPS[step];
    var r = document.querySelector(s.target).getBoundingClientRect();
    var pad = s.pad;
    var x = r.left - pad, y = r.top - pad, w = r.width + pad * 2, h = r.height + pad * 2;
    spot.style.left = x + "px";
    spot.style.top = y + "px";
    spot.style.width = w + "px";
    spot.style.height = h + "px";

    var vw = window.innerWidth, vh = window.innerHeight;
    var cw = Math.min(340, vw - 32);
    card.style.width = cw + "px";
    var ch = card.offsetHeight;
    var side, cy;
    if (vh - (y + h) >= ch + 24) { side = "below"; cy = y + h + 16; }
    else if (y >= ch + 24) { side = "above"; cy = y - ch - 16; }
    else { side = "none"; cy = vh - ch - 16; }
    var cx = Math.min(Math.max(16, x + w / 2 - cw / 2), vw - cw - 16);
    card.style.left = cx + "px";
    card.style.top = cy + "px";
    card.dataset.side = side;
    card.style.setProperty("--ax", Math.min(Math.max(x + w / 2 - cx, 22), cw - 22) + "px");
  }

  function close(done) {
    try {
      if (done) localStorage.setItem(DONE_KEY, "tamam");
      else sessionStorage.setItem(SKIP_KEY, "1");
    } catch (e) {}
    if (done) document.getElementById("garageBtn").classList.remove("is-new");
    window.removeEventListener("resize", schedule);
    window.removeEventListener("scroll", schedule);
    document.removeEventListener("keydown", onKey);
    root.classList.remove("open");
    root.classList.add("closing");
    document.documentElement.classList.remove("tour-lock");
    setTimeout(function () { root.remove(); }, 450);
  }

  function start() {
    build();
    show(0);
  }

  // Yükleme ekranı kalkıp giriş animasyonları oynadıktan sonra başla.
  function whenReady() {
    if (document.body.classList.contains("ready")) { setTimeout(start, 1400); return; }
    new MutationObserver(function (_, obs) {
      if (!document.body.classList.contains("ready")) return;
      obs.disconnect();
      setTimeout(start, 1400);
    }).observe(document.body, { attributes: true, attributeFilter: ["class"] });
  }
  whenReady();
})();

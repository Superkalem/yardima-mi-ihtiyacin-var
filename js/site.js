// Her sayfada ortak: Shell logolu yükleme ekranı, sayfa geçişi ve Garajım butonu.
(function () {
  var loader = document.getElementById("loader");
  var loaderText = loader.querySelector(".loader-text");
  var MIN_VISIBLE = 600; // logo animasyonu en az bu kadar görünsün (ms)

  function show(text) {
    loaderText.textContent = text || "";
    loader.classList.remove("hidden");
  }
  function hide() {
    loader.classList.add("hidden");
    document.body.classList.add("ready");
  }
  window.ShellLoader = { show: show, hide: hide };

  // İlk açılış: sayfa yüklenince kapat (görseller takılırsa en geç 3 sn).
  function hideAfterLoad() {
    setTimeout(hide, Math.max(0, MIN_VISIBLE - performance.now()));
  }
  if (document.readyState === "complete") hideAfterLoad();
  else window.addEventListener("load", hideAfterLoad);
  setTimeout(hide, 3000);

  // Sayfalar arası geçişte logoyu göster, sonra git.
  document.querySelectorAll('a[href$=".html"]').forEach(function (a) {
    if (a.target) return;
    a.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      show();
      setTimeout(function () { location.href = a.getAttribute("href"); }, 400);
    });
  });
  // Geri tuşuyla önbellekten dönülürse ekran açık kalmasın.
  window.addEventListener("pageshow", function (e) { if (e.persisted) hide(); });

  // Garajım butonu: kullanıcı Garajım'ı görene kadar üzerinde "yeni" noktası durur.
  // Aynı anahtarı ana sayfadaki tanıtım turu (tour.js) da kullanır.
  var garageBtn = document.getElementById("garageBtn");
  try {
    if (garageBtn.getAttribute("aria-current") === "page") localStorage.setItem("garajTuru", "tamam");
    else if (localStorage.getItem("garajTuru") !== "tamam") garageBtn.classList.add("is-new");
  } catch (e) {}
})();

(function () {
  var state = { brand: null, model: null, fuel: null, year: null, km: 60000 };
  var MAX_YEAR = new Date().getFullYear() + 1;
  var FUELS = [
    { value: "benzin", label: "Benzin" },
    { value: "dizel", label: "Dizel" },
    { value: "hibrit", label: "Hibrit" }
  ];
  var CHECK = '<svg class="dd-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  var SEARCH_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>';
  var CAR_ICON = '<svg viewBox="0 0 64 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 24v-5c0-2 1.5-3.5 3.5-4l9-2 7-6.5c1.2-1 2.6-1.5 4-1.5h12c2 0 3.8.9 5 2.5l4.5 5.5 6 1.2c2 .4 3 2 3 4V24h-4M14 24h28"/><circle cx="10" cy="24" r="4"/><circle cx="48" cy="24" r="4"/></svg>';
  var SEARCH_MIN = 12; // bundan uzun listelerde arama kutusu çıkar

  var $ = function (id) { return document.getElementById(id); };
  var fmt = function (n) { return n.toLocaleString("tr-TR"); };
  // Aramada büyük/küçük harf, Türkçe ı/i ve aksan (ë, é) farkı gözetilmez.
  function norm(s) {
    return s.toLocaleLowerCase("tr").replace(/ı/g, "i").normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  // ---------- Açılır kutu ----------
  // Liste sayfayı itmeden kutunun altında (yer yoksa üstünde) açılır.
  var dropdowns = [];

  function makeDropdown(id, onSelect) {
    var root = $(id);
    var field = root.querySelector(".dd-field");
    var valueEl = root.querySelector(".dd-value");
    var panel = root.querySelector(".dd-panel");
    var inner = root.querySelector(".dd-inner");
    var list = root.querySelector(".dd-list");
    var placeholder = valueEl.textContent;
    var search = null;
    var dd = { value: null };

    function filter(q) {
      var n = norm(q.trim());
      var shown = 0;
      list.querySelectorAll(".dd-option, .dd-group").forEach(function (el) {
        var hide = n
          ? el.classList.contains("dd-group") || el.dataset.dup === "1" || el.dataset.key.indexOf(n) === -1
          : false;
        el.hidden = hide;
        if (!hide && el.classList.contains("dd-option")) shown++;
      });
      list.classList.toggle("no-results", shown === 0);
    }

    // items: { value, label } ya da başlık için { header }. dup: aramada gizlenen tekrar.
    dd.setOptions = function (items) {
      list.innerHTML = "";
      items.forEach(function (it) {
        if (it.header) {
          var h = document.createElement("div");
          h.className = "dd-group";
          h.textContent = it.header;
          list.appendChild(h);
          return;
        }
        var b = document.createElement("button");
        b.type = "button";
        b.className = "dd-option";
        b.setAttribute("role", "option");
        b.dataset.key = norm(it.label);
        if (it.dup) b.dataset.dup = "1";
        b.innerHTML = "<span>" + it.label + "</span>" + CHECK;
        if (dd.value === it.value) b.classList.add("selected");
        b.addEventListener("click", function () {
          dd.value = it.value;
          valueEl.textContent = it.label;
          root.classList.add("filled");
          list.querySelectorAll(".selected").forEach(function (x) { x.classList.remove("selected"); });
          list.querySelectorAll(".dd-option").forEach(function (x) { if (x.dataset.key === b.dataset.key) x.classList.add("selected"); });
          dd.close();
          onSelect(it.value);
        });
        list.appendChild(b);
      });

      var options = items.filter(function (it) { return !it.header && !it.dup; }).length;
      if (options > SEARCH_MIN && !search) {
        var wrap = document.createElement("label");
        wrap.className = "dd-search";
        wrap.innerHTML = SEARCH_ICON + '<input type="search" placeholder="Ara…" autocomplete="off" aria-label="Listede ara">';
        inner.insertBefore(wrap, list);
        search = wrap.querySelector("input");
        search.addEventListener("input", function () { filter(search.value); });
        search.addEventListener("keydown", function (e) {
          if (e.key !== "Enter") return;
          e.preventDefault();
          var first = list.querySelector(".dd-option:not([hidden])");
          if (first) first.click();
        });
      } else if (options <= SEARCH_MIN && search) {
        search.parentNode.remove();
        search = null;
      }
    };
    dd.reset = function () {
      dd.value = null;
      valueEl.textContent = placeholder;
      root.classList.remove("filled");
      list.querySelectorAll(".selected").forEach(function (x) { x.classList.remove("selected"); });
    };
    dd.open = function () {
      dropdowns.forEach(function (d) { if (d !== dd) d.close(); });
      if (search) { search.value = ""; filter(""); }

      // Aşağıda yer yoksa yukarı aç; yüksekliği ekrana göre ayarla.
      var form = root.offsetParent;
      var rect = field.getBoundingClientRect();
      var below = window.innerHeight - rect.bottom - 12;
      var above = rect.top - 76;
      var up = below < 240 && above > below;
      var room = Math.max(160, Math.min(340, up ? above : below));
      list.style.maxHeight = room - (search ? 52 : 0) + "px";
      panel.style.top = up ? "auto" : root.offsetTop + field.offsetHeight + 6 + "px";
      panel.style.bottom = up ? form.clientHeight - root.offsetTop + 6 + "px" : "auto";
      root.classList.toggle("up", up);

      root.classList.add("open");
      field.setAttribute("aria-expanded", "true");
      var sel = list.querySelector(".selected:not([data-dup])") || list.querySelector(".selected");
      list.scrollTop = sel ? sel.offsetTop - list.clientHeight / 2 : 0;
      if (search && window.matchMedia("(pointer: fine)").matches) search.focus();
    };
    dd.close = function () {
      root.classList.remove("open");
      field.setAttribute("aria-expanded", "false");
    };

    field.addEventListener("click", function () {
      if (root.classList.contains("open")) dd.close();
      else dd.open();
    });
    dropdowns.push(dd);
    return dd;
  }

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".dd")) dropdowns.forEach(function (d) { d.close(); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") dropdowns.forEach(function (d) { d.close(); });
  });

  function openNext(dd) { setTimeout(dd.open, 300); }

  // ---------- Araç vitrini ----------
  // Seçim ilerledikçe dolar: marka → model → yıl seçilince o kasanın fotoğrafı.
  function renderStage() {
    var st = $("carPreview");
    var name = [state.brand, state.model].filter(Boolean).join(" ");
    if (state.brand && state.model && state.year) {
      st.className = "car-stage has-car";
      st.innerHTML =
        '<div class="car-photo"></div>' +
        '<div class="stage-caption"><strong>' + name + "</strong><span>" + state.year + "</span></div>" +
        '<small class="stage-credit">Fotoğraf: Wikipedia</small>';
      CarPhoto.photo(st.querySelector(".car-photo"), state.brand, state.model, state.year);
      return;
    }
    st.className = "car-stage";
    st.innerHTML =
      '<div class="stage-empty">' + CAR_ICON +
        "<strong>" + (name || "Aracını seç") + "</strong>" +
        "<span>" + (!state.brand ? "Marka ile başla" : !state.model ? "Şimdi modelini seç" : "Yılı seçince fotoğrafı gelir") + "</span>" +
      "</div>";
  }

  // ---------- Seçimler ----------
  function modelYears(brand, model) {
    var m = carModels(brand).filter(function (x) { return x.name === model; })[0];
    var from = Math.max(CAR_MIN_YEAR, m.from);
    var to = Math.min(m.to || MAX_YEAR, MAX_YEAR);
    var years = [];
    for (var y = to; y >= from; y--) years.push({ value: y, label: String(y) });
    return years;
  }

  var brandDd = makeDropdown("ddBrand", function (v) {
    state.brand = v;
    state.model = null;
    modelDd.reset();
    modelDd.setOptions(carModels(v).map(function (m) { return { value: m.name, label: m.name }; }));
    renderStage();
    unlock("stepModel");
    update();
    openNext(modelDd);
  });
  brandDd.setOptions(
    [{ header: "Popüler markalar" }]
      .concat(POPULAR_BRANDS.map(function (n) { return { value: n, label: n, dup: true }; }))
      .concat([{ header: "Tüm markalar (A–Z)" }])
      .concat(carBrands().map(function (n) { return { value: n, label: n }; }))
  );

  var modelDd = makeDropdown("ddModel", function (v) {
    state.model = v;
    var years = modelYears(state.brand, state.model);
    yearDd.setOptions(years);
    // Seçili yıl bu modelin üretim yılları dışında kaldıysa sıfırla.
    if (state.year && !years.some(function (y) { return y.value === state.year; })) {
      state.year = null;
      yearDd.reset();
    }
    renderStage();
    unlock("stepFuel");
    update();
    if (!state.fuel) openNext(fuelDd);
    else if (!state.year) openNext(yearDd);
  });

  var fuelDd = makeDropdown("ddFuel", function (v) {
    state.fuel = v;
    unlock("stepYear");
    update();
    if (!state.year) openNext(yearDd);
  });
  fuelDd.setOptions(FUELS);

  var yearDd = makeDropdown("ddYear", function (v) {
    state.year = v;
    renderStage();
    unlock("stepKm");
    update();
  });

  renderStage();

  // ---------- Km ----------
  var kmRange = $("kmRange");
  function setKm() {
    state.km = parseInt(kmRange.value, 10);
    $("kmValue").textContent = fmt(state.km) + (state.km >= 400000 ? "+" : "");
    kmRange.style.setProperty("--p", (state.km / 400000) * 100 + "%");
    hideResult();
  }
  kmRange.addEventListener("input", setKm);
  setKm();

  // ---------- Ortak ----------
  function unlock(id) { $(id).classList.remove("locked"); }

  function update() {
    $("showBtn").disabled = !(state.brand && state.model && state.fuel && state.year);
    hideResult();
  }

  function hideResult() {
    var r = $("result");
    if (r.classList.contains("visible")) {
      r.classList.remove("visible");
      r.innerHTML = "";
    }
  }

  // ---------- Göster ----------
  var showBtn = $("showBtn");
  showBtn.addEventListener("click", function () {
    if (showBtn.disabled) return;
    ShellLoader.show("Aracına uygun ürünler hazırlanıyor");
    setTimeout(function () {
      renderResult(
        getOil(state.brand, state.model, state.year, state.fuel, state.km),
        getCoolant(state.brand, state.year)
      );
      ShellLoader.hide();
    }, 1100);
  });

  // "AP-L" gibi kodlar satır sonunda bölünmesin.
  function nobreak(s) { return s.replace(/-/g, "‑"); }

  function productImageHtml(p) {
    var src = shellImage(p);
    return src
      ? '<div class="product-img"><img src="' + src + '" alt="Shell ' + p.name + " " + p.visc + '"></div>'
      : '<div class="product-img no-img"><img src="img/shell-pecten.svg" alt="Shell"></div>';
  }

  function renderResult(oil, coolant) {
    var fuelText = { benzin: "Benzin", dizel: "Dizel", hibrit: "Hibrit" }[state.fuel];
    var p = oil.product;
    var alt = oil.alt;
    var html =
      '<div class="result-head">' +
        "<h2>" + state.brand + " " + state.model + " için öneriler</h2>" +
        "<p>" + state.year + " · " + fuelText + " · " + fmt(state.km) + " km</p>" +
      "</div>" +

      '<div class="card">' +
        '<div class="card-title">Motor yağı</div>' +
        productImageHtml(p) +
        '<div class="card-body">' +
          '<div class="product-name">Shell ' + nobreak(p.name) + "</div>" +
          '<span class="visc-badge">' + p.visc + "</span>" +
          (oil.generic ? ' <span class="chip warn">Genel öneri</span>' : "") +
          '<dl class="kv">' +
            "<div><dt>" + (oil.generic ? "Önerilen norm" : "Aracının istediği norm") + "</dt><dd>" + oil.spec + "</dd></div>" +
            (p.approvals.replace(/ · /g, " / ") !== oil.spec ? "<div><dt>Ürün onayları</dt><dd>" + p.approvals + "</dd></div>" : "") +
            "<div><dt>Yağ tipi</dt><dd>" + oil.type + "</dd></div>" +
            "<div><dt>Değişim aralığı</dt><dd>" + fmt(oil.interval) + " km veya 1 yıl</dd></div>" +
            "<div><dt>Sonraki değişim</dt><dd>" + fmt(oil.next) + " km</dd></div>" +
          "</dl>" +
          '<a class="text-link" href="https://lubematch.shell.com" target="_blank" rel="noopener">Shell LubeMatch ile doğrula →</a>' +
        "</div>" +
        (alt
          ? '<div class="alt-product">' +
              (shellImage(alt) ? '<img src="' + shellImage(alt) + '" alt="">' : "") +
              "<div><small>Alternatif</small><strong>Shell " + nobreak(alt.name) + " " + alt.visc + "</strong></div>" +
            "</div>"
          : "") +
      "</div>" +

      '<div class="card d1">' +
        '<div class="card-title">Antifriz</div>' +
        '<div class="card-body">' +
          '<div class="coolant-head">' +
            '<span class="swatch' + (coolant.color ? "" : " unknown") + '" style="--c:' + (coolant.color || "transparent") + '"></span>' +
            "<div>" +
              '<div class="coolant-name">' + coolant.name + "</div>" +
              '<div class="coolant-spec">' + coolant.spec + "</div>" +
            "</div>" +
          "</div>" +
          '<dl class="kv">' +
            "<div><dt>Tip</dt><dd>" + coolant.type + "</dd></div>" +
            "<div><dt>Renk</dt><dd>" + coolant.colorName + "</dd></div>" +
            "<div><dt>Karışım oranı</dt><dd>" + coolant.mix + "</dd></div>" +
            "<div><dt>Donma koruması</dt><dd>" + coolant.protection + "</dd></div>" +
            "<div><dt>Değişim</dt><dd>" + coolant.interval + "</dd></div>" +
          "</dl>" +
        "</div>" +
      "</div>" +

      '<div class="notice">' + oil.note + " Farklı tip antifrizleri birbirine karıştırma; renge değil norma göre seç.</div>" +
      '<p class="disclaimer">Öneriler genel üretici normlarına dayanır ve motor koduna göre değişebilir. Kesin bilgi için aracının kullanım kılavuzuna, Shell LubeMatch\'e veya yetkili servise başvurun.</p>' +
      '<div class="result-actions">' +
        '<button type="button" class="btn btn-red btn-block" id="saveBtn">Garajıma ekle</button>' +
        '<p class="save-hint">Aracını kaydet; yağ değişimi, muayene ve sigorta tarihlerini takip et.</p>' +
        '<button type="button" class="btn btn-outline btn-block" id="resetBtn">Başka bir araç seç</button>' +
      "</div>";

    var r = $("result");
    r.innerHTML = html;
    r.classList.add("visible");
    r.scrollIntoView({ block: "start" });
    $("resetBtn").addEventListener("click", function () { location.reload(); });
    // Araç garaj sayfasına sessionStorage ile taşınır; giriş yapıldıktan sonra orada kaydedilir.
    $("saveBtn").addEventListener("click", function () {
      try {
        sessionStorage.setItem("bekleyenArac", JSON.stringify({
          brand: state.brand, model: state.model, fuel: state.fuel, year: state.year, km: state.km
        }));
      } catch (e) {}
      ShellLoader.show("Garajına ekleniyor");
      setTimeout(function () { location.href = "garaj.html"; }, 400);
    });
  }
})();

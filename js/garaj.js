(function () {
  var $ = function (id) { return document.getElementById(id); };
  var fmt = function (n) { return Number(n).toLocaleString("tr-TR"); };

  var FUEL_TEXT = { benzin: "Benzin", dizel: "Dizel", hibrit: "Hibrit" };
  var RECORD_TYPES = [
    ["yag", "Motor yağı değişimi"],
    ["yag-filtresi", "Yağ filtresi"],
    ["hava-filtresi", "Hava filtresi"],
    ["polen-filtresi", "Polen filtresi"],
    ["yakit-filtresi", "Yakıt filtresi"],
    ["antifriz", "Antifriz değişimi"],
    ["fren", "Fren balata / disk"],
    ["lastik", "Lastik"],
    ["aku", "Akü"],
    ["muayene", "Muayene"],
    ["diger", "Diğer"]
  ];
  var DATE_FIELDS = [
    ["muayene", "Araç muayenesi"],
    ["sigorta", "Trafik sigortası"],
    ["kasko", "Kasko"]
  ];
  var COOLANT_YEARS = 4;

  var user = null;
  var signUpMode = false;

  // ---------- Yardımcılar ----------
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function isoDate(d) {
    var z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return z.toISOString().slice(0, 10);
  }
  function today() { return isoDate(new Date()); }
  function parseDate(s) { return new Date(s + "T00:00:00"); }
  function addYears(s, n) { var d = parseDate(s); d.setFullYear(d.getFullYear() + n); return isoDate(d); }
  function daysUntil(s) { return Math.round((parseDate(s) - parseDate(today())) / 864e5); }
  function trDate(s) { return parseDate(s).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }); }
  function recordLabel(type) {
    var t = RECORD_TYPES.filter(function (r) { return r[0] === type; })[0];
    return t ? t[1] : type;
  }

  function level(days) { return days < 0 ? "bad" : days <= 30 ? "warn" : "ok"; }
  function dayText(days) {
    if (days < 0) return Math.abs(days) + " gün geçti";
    if (days === 0) return "Bugün";
    return days + " gün kaldı";
  }

  var toastTimer;
  function toast(msg) {
    var t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2400);
  }
  function fail(e) { toast(Store.errorText(e) || "Bir hata oluştu."); }

  // ---------- Takip hesapları ----------
  // Yağ: değişim aralığı (km) aracın kilometresine göre data.js'den; süre en fazla 1 yıl.
  function oilStatus(v) {
    if (!v.oil) return null;
    var interval = getOil(v.brand, v.model, v.year, v.fuel, v.km).interval;
    var dueKm = v.oil.km + interval;
    var dueDate = addYears(v.oil.date, 1);
    var leftKm = dueKm - v.km;
    var leftDays = daysUntil(dueDate);
    var lvl = leftKm <= 0 || leftDays < 0 ? "bad" : leftKm <= 1000 || leftDays <= 30 ? "warn" : "ok";
    return {
      interval: interval,
      dueKm: dueKm,
      dueDate: dueDate,
      used: Math.min(1, Math.max(0, (v.km - v.oil.km) / interval)),
      level: lvl,
      text: lvl === "bad"
        ? "Yağ değişim zamanı geldi"
        : "Yağ değişimine " + fmt(leftKm) + " km · " + leftDays + " gün"
    };
  }

  function coolantStatus(v) {
    if (!v.coolantDate) return null;
    var due = addYears(v.coolantDate, COOLANT_YEARS);
    var days = daysUntil(due);
    return { due: due, days: days, level: level(days) };
  }

  // Liste kartında gösterilecek uyarılar (yaklaşan ya da geçmiş olanlar).
  function alerts(v) {
    var out = [];
    var c = coolantStatus(v);
    if (c && c.level !== "ok") out.push({ level: c.level, text: "Antifriz " + dayText(c.days).toLowerCase() });
    DATE_FIELDS.forEach(function (f) {
      var d = v.dates && v.dates[f[0]];
      if (!d) return;
      var days = daysUntil(d);
      if (days <= 30) out.push({ level: level(days), text: f[1] + " · " + dayText(days).toLowerCase() });
    });
    return out;
  }

  function chip(lvl, text) { return '<span class="chip ' + lvl + '">' + esc(text) + "</span>"; }
  function meter(lvl, ratio) {
    return '<div class="meter ' + lvl + '"><span style="width:' + Math.round(ratio * 100) + '%"></span></div>';
  }

  // ---------- Giriş ----------
  function showView(name) {
    $("authView").hidden = name !== "auth";
    $("listView").hidden = name !== "list";
    $("detailView").hidden = name !== "detail";
  }

  function setAuthMode(signUp) {
    signUpMode = signUp;
    $("authTitle").textContent = signUp ? "Hesap oluştur" : "Giriş yap";
    $("emailSubmit").textContent = signUp ? "Hesap oluştur" : "Giriş yap";
    $("authToggle").textContent = signUp ? "Zaten hesabın var mı? Giriş yap" : "Hesabın yok mu? Hesap oluştur";
    $("password").setAttribute("autocomplete", signUp ? "new-password" : "current-password");
    $("authError").textContent = "";
  }

  function wireAuth() {
    $("authToggle").addEventListener("click", function () { setAuthMode(!signUpMode); });
    $("googleBtn").addEventListener("click", function () {
      $("authError").textContent = "";
      Store.signInGoogle().catch(function (e) { $("authError").textContent = Store.errorText(e); });
    });
    $("emailForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var email = $("email").value.trim();
      var pw = $("password").value;
      if (!email || !pw) { $("authError").textContent = "E-posta ve şifreni yaz."; return; }
      $("emailSubmit").disabled = true;
      (signUpMode ? Store.signUp(email, pw) : Store.signIn(email, pw))
        .catch(function (err) { $("authError").textContent = Store.errorText(err); })
        .then(function () { $("emailSubmit").disabled = false; });
    });
    $("resetPw").addEventListener("click", function () {
      var email = $("email").value.trim();
      if (!email) { $("authError").textContent = "Önce e-posta adresini yaz."; return; }
      Store.resetPassword(email)
        .then(function () { $("authError").textContent = ""; toast("Şifre sıfırlama e-postası gönderildi."); })
        .catch(function (err) { $("authError").textContent = Store.errorText(err); });
    });
  }

  function renderAccountLine() {
    var line = $("accountLine");
    if (user.demo) {
      line.innerHTML = "Demo modu: araçların bu cihazın tarayıcısında saklanır.";
      return;
    }
    line.innerHTML = esc(user.email || user.name || "Hesabın") + ' · <button type="button" class="link-btn" id="signOut">Çıkış yap</button>';
    $("signOut").addEventListener("click", function () {
      Store.signOut().then(function () { location.hash = ""; });
    });
  }

  // ekle.html'deki "Garajıma ekle" ile gelen aracı kaydet.
  function savePending() {
    var pending = null;
    try {
      pending = JSON.parse(sessionStorage.getItem("bekleyenArac"));
      sessionStorage.removeItem("bekleyenArac");
    } catch (e) {}
    if (!pending) return Promise.resolve();
    return Store.addVehicle({
      brand: pending.brand,
      model: pending.model,
      fuel: pending.fuel,
      year: pending.year,
      km: pending.km,
      plate: "",
      oil: null,
      coolantDate: null,
      dates: {}
    }).then(function (id) {
      toast(pending.brand + " " + pending.model + " garajına eklendi.");
      history.replaceState(null, "", "#arac-" + id);
    });
  }

  // ---------- Yönlendirme ----------
  function route() {
    var m = location.hash.match(/^#arac-(.+)$/);
    if (m) renderDetail(m[1]);
    else renderList();
  }

  // ---------- Araç listesi ----------
  function renderList() {
    showView("list");
    var box = $("garageList");
    box.innerHTML = '<p class="muted">Garajın yükleniyor…</p>';
    Store.listVehicles().then(function (list) {
      if (!list.length) {
        box.innerHTML =
          '<div class="empty">' +
            "<h2>Garajın boş</h2>" +
            "<p>Aracını ekle; uygun Shell yağını gör, yağ değişimi ve muayene tarihlerini takip et.</p>" +
            '<a href="ekle.html" class="btn btn-red">Araç ekle</a>' +
          "</div>";
        return;
      }
      box.innerHTML = list.map(function (v) {
        var oil = oilStatus(v);
        var warn = alerts(v);
        return '<a class="vehicle-card" href="#arac-' + esc(v.id) + '">' +
          '<div class="car-photo" data-vid="' + esc(v.id) + '"></div>' +
          '<div class="vc-body">' +
            '<div class="vc-title">' + esc(v.brand + " " + v.model) + (v.plate ? '<span class="plate">' + esc(v.plate) + "</span>" : "") + "</div>" +
            '<div class="vc-meta">' + v.year + " · " + FUEL_TEXT[v.fuel] + " · " + fmt(v.km) + " km</div>" +
            (oil
              ? meter(oil.level, oil.used) + '<div class="vc-oil ' + oil.level + '">' + oil.text + "</div>"
              : '<div class="vc-oil muted">Son yağ değişimini gir →</div>') +
            (warn.length ? '<div class="chips">' + warn.map(function (a) { return chip(a.level, a.text); }).join("") + "</div>" : "") +
          "</div>" +
        "</a>";
      }).join("");
      list.forEach(function (v) {
        CarPhoto.photo(box.querySelector('[data-vid="' + v.id + '"]'), v.brand, v.model, v.year);
      });
    }).catch(function (e) {
      box.innerHTML = '<p class="form-error">' + esc(Store.errorText(e)) + "</p>";
    });
  }

  // ---------- Araç detayı ----------
  function renderDetail(id) {
    showView("detail");
    var box = $("detailView");
    if (!box.dataset.id || box.dataset.id !== id) box.innerHTML = '<p class="muted">Yükleniyor…</p>';
    Promise.all([Store.getVehicle(id), Store.listRecords(id)]).then(function (res) {
      var v = res[0];
      var records = res[1];
      var keepPhoto = box.dataset.id === id && box.querySelector(".car-card");
      var photo = keepPhoto ? box.querySelector(".car-card") : null;
      box.dataset.id = id;
      box.innerHTML = detailHtml(v, records);
      if (photo) box.querySelector(".car-card").replaceWith(photo);
      else CarPhoto.show(box.querySelector(".car-card"), v.brand, v.model, v.year);
      wireDetail(v);
    }).catch(function (e) {
      box.innerHTML = '<p class="form-error">' + esc(Store.errorText(e)) + '</p><a href="#" class="text-link">← Garajım</a>';
    });
  }

  function detailHtml(v, records) {
    var oilInfo = getOil(v.brand, v.model, v.year, v.fuel, v.km);
    var p = oilInfo.product;
    var oil = oilStatus(v);
    var coolant = getCoolant(v.brand, v.year);
    var cs = coolantStatus(v);
    var total = records.reduce(function (s, r) { return s + (Number(r.cost) || 0); }, 0);
    var img = shellImage(p);

    return '<a href="#" class="back-link">← Garajım</a>' +
      '<div class="car-card"></div>' +

      '<div class="detail-head">' +
        "<h1>" + esc(v.brand + " " + v.model) + "</h1>" +
        '<p class="sub">' + v.year + " · " + FUEL_TEXT[v.fuel] + "</p>" +
      "</div>" +

      // Araç bilgileri
      '<div class="card">' +
        '<div class="card-title">Araç bilgileri</div>' +
        '<div class="card-body form-grid">' +
          "<div>" +
            '<label class="field-label" for="plateInput">Plaka</label>' +
            '<input class="input plate-input" id="plateInput" value="' + esc(v.plate) + '" placeholder="34 ABC 123" maxlength="12" autocomplete="off">' +
          "</div>" +
          '<form id="kmForm">' +
            '<label class="field-label" for="kmInput">Güncel kilometre</label>' +
            '<div class="inline-form">' +
              '<input class="input" id="kmInput" type="number" inputmode="numeric" min="0" step="1" value="' + v.km + '">' +
              '<button type="submit" class="btn btn-red btn-sm">Güncelle</button>' +
            "</div>" +
          "</form>" +
        "</div>" +
      "</div>" +

      // Motor yağı
      '<div class="card">' +
        '<div class="card-title">Motor yağı</div>' +
        '<div class="card-body">' +
          '<div class="mini-product">' +
            (img ? '<img src="' + img + '" alt="">' : '<img class="pecten" src="img/shell-pecten.svg" alt="">') +
            "<div><small>Önerilen</small><strong>Shell " + esc(p.name) + " " + p.visc + "</strong><span>" + esc(oilInfo.spec) + (oilInfo.generic ? " · genel öneri" : "") + "</span></div>" +
          "</div>" +
          (oil
            ? '<div class="status-row">' + meter(oil.level, oil.used) + '<p class="status-text ' + oil.level + '">' + oil.text + "</p></div>" +
              '<dl class="kv">' +
                "<div><dt>Son değişim</dt><dd>" + fmt(v.oil.km) + " km · " + trDate(v.oil.date) + "</dd></div>" +
                "<div><dt>Sonraki değişim</dt><dd>" + fmt(oil.dueKm) + " km veya " + trDate(oil.dueDate) + "</dd></div>" +
                "<div><dt>Değişim aralığı</dt><dd>" + fmt(oil.interval) + " km / 1 yıl</dd></div>" +
              "</dl>"
            : '<p class="hint">Son yağ değişimini gir; sıradaki değişimi senin için takip edelim.</p>') +
          '<button type="button" class="btn btn-red btn-block" id="oilToday">Yağı bugün değiştirdim</button>' +
          '<details class="more"' + (oil ? "" : " open") + "><summary>Son değişimi elle gir</summary>" +
            '<form id="oilForm" class="form-row">' +
              '<div><label class="field-label" for="oilKm">Kilometre</label><input class="input" id="oilKm" type="number" inputmode="numeric" min="0" value="' + (v.oil ? v.oil.km : v.km) + '" required></div>' +
              '<div><label class="field-label" for="oilDate">Tarih</label><input class="input" id="oilDate" type="date" max="' + today() + '" value="' + (v.oil ? v.oil.date : today()) + '" required></div>' +
              '<button type="submit" class="btn btn-outline btn-block span-2">Kaydet</button>' +
            "</form>" +
          "</details>" +
        "</div>" +
      "</div>" +

      // Antifriz
      '<div class="card">' +
        '<div class="card-title">Antifriz</div>' +
        '<div class="card-body">' +
          '<div class="coolant-head">' +
            '<span class="swatch' + (coolant.color ? "" : " unknown") + '" style="--c:' + (coolant.color || "transparent") + '"></span>' +
            '<div><div class="coolant-name">' + esc(coolant.name) + '</div><div class="coolant-spec">' + esc(coolant.spec) + " · " + esc(coolant.type) + "</div></div>" +
          "</div>" +
          (cs
            ? '<dl class="kv">' +
                "<div><dt>Son değişim</dt><dd>" + trDate(v.coolantDate) + "</dd></div>" +
                "<div><dt>Sonraki değişim</dt><dd>" + trDate(cs.due) + " " + chip(cs.level, dayText(cs.days)) + "</dd></div>" +
              "</dl>"
            : '<p class="hint">Antifrizi en son ne zaman değiştirdin? Tarihi gir, ' + COOLANT_YEARS + " yılda bir hatırlatalım.</p>") +
          '<div class="inline-form">' +
            '<input class="input" id="coolantDate" type="date" max="' + today() + '" value="' + (v.coolantDate || "") + '" aria-label="Son antifriz değişim tarihi">' +
            '<button type="button" class="btn btn-outline btn-sm" id="coolantToday">Bugün</button>' +
          "</div>" +
        "</div>" +
      "</div>" +

      // Önemli tarihler
      '<div class="card">' +
        '<div class="card-title">Önemli tarihler</div>' +
        '<div class="card-body date-list">' +
          DATE_FIELDS.map(function (f) {
            var d = v.dates && v.dates[f[0]];
            var days = d ? daysUntil(d) : null;
            return '<div class="date-row">' +
              '<label class="field-label" for="date-' + f[0] + '">' + f[1] + (d ? " " + chip(level(days), dayText(days)) : "") + "</label>" +
              '<input class="input" type="date" id="date-' + f[0] + '" data-key="' + f[0] + '" value="' + (d || "") + '">' +
            "</div>";
          }).join("") +
          '<p class="hint">Bitiş / son geçerlilik tarihlerini gir; 30 gün kala uyarı gösterilir.</p>' +
        "</div>" +
      "</div>" +

      // Bakım geçmişi
      '<div class="card">' +
        '<div class="card-title">Bakım geçmişi</div>' +
        '<div class="card-body">' +
          '<details class="more"><summary>Yeni kayıt ekle</summary>' +
            '<form id="recordForm" class="form-row">' +
              '<div class="span-2"><label class="field-label" for="recType">İşlem</label><select class="input" id="recType">' +
                RECORD_TYPES.map(function (t) { return '<option value="' + t[0] + '">' + t[1] + "</option>"; }).join("") +
              "</select></div>" +
              '<div><label class="field-label" for="recDate">Tarih</label><input class="input" id="recDate" type="date" max="' + today() + '" value="' + today() + '" required></div>' +
              '<div><label class="field-label" for="recKm">Kilometre</label><input class="input" id="recKm" type="number" inputmode="numeric" min="0" value="' + v.km + '"></div>' +
              '<div class="span-2"><label class="field-label" for="recCost">Tutar (₺)</label><input class="input" id="recCost" type="number" inputmode="decimal" min="0" step="0.01" placeholder="İsteğe bağlı"></div>' +
              '<div class="span-2"><label class="field-label" for="recNote">Not</label><input class="input" id="recNote" maxlength="140" placeholder="Örn. Shell Helix Ultra 5W-30, servis adı"></div>' +
              '<button type="submit" class="btn btn-red btn-block span-2">Kaydı ekle</button>' +
            "</form>" +
          "</details>" +
          (records.length
            ? '<ul class="records">' + records.map(function (r) {
                return "<li>" +
                  '<div><strong>' + esc(recordLabel(r.type)) + "</strong>" +
                  "<span>" + trDate(r.date) + (r.km ? " · " + fmt(r.km) + " km" : "") + "</span>" +
                  (r.note ? "<em>" + esc(r.note) + "</em>" : "") + "</div>" +
                  '<div class="rec-side">' + (r.cost ? "<b>" + fmt(r.cost) + " ₺</b>" : "") +
                  '<button type="button" class="icon-del" data-rid="' + esc(r.id) + '" aria-label="Kaydı sil">' +
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
                  "</button></div>" +
                "</li>";
              }).join("") + "</ul>" +
              (total ? '<p class="total">Toplam masraf <b>' + fmt(total) + " ₺</b></p>" : "")
            : '<p class="hint">Henüz kayıt yok.</p>') +
        "</div>" +
      "</div>" +

      '<button type="button" class="btn btn-danger btn-block" id="deleteVehicle">Aracı garajdan sil</button>';
  }

  function wireDetail(v) {
    var id = v.id;
    function save(patch, msg) {
      return Store.updateVehicle(id, patch).then(function () {
        if (msg) toast(msg);
        renderDetail(id);
      }).catch(fail);
    }

    $("plateInput").addEventListener("change", function () {
      save({ plate: this.value.trim().toUpperCase() }, "Plaka kaydedildi.");
    });

    $("kmForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var km = parseInt($("kmInput").value, 10);
      if (isNaN(km) || km < 0) { toast("Geçerli bir kilometre yaz."); return; }
      if (km < v.km && !confirm("Yeni kilometre öncekinden (" + fmt(v.km) + ") düşük. Yine de kaydedilsin mi?")) return;
      save({ km: km }, "Kilometre güncellendi.");
    });

    function setOil(km, date, note) {
      Promise.all([
        Store.updateVehicle(id, { oil: { km: km, date: date }, km: Math.max(km, v.km) }),
        Store.addRecord(id, { type: "yag", date: date, km: km, cost: null, note: note || "" })
      ]).then(function () { toast("Yağ değişimi kaydedildi."); renderDetail(id); }).catch(fail);
    }
    var p = getOil(v.brand, v.model, v.year, v.fuel, v.km).product;
    $("oilToday").addEventListener("click", function () {
      setOil(v.km, today(), "Shell " + p.name + " " + p.visc);
    });
    $("oilForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var km = parseInt($("oilKm").value, 10);
      var date = $("oilDate").value;
      if (isNaN(km) || !date) { toast("Kilometre ve tarihi gir."); return; }
      setOil(km, date, "");
    });

    function setCoolant(date) {
      Promise.all([
        Store.updateVehicle(id, { coolantDate: date }),
        Store.addRecord(id, { type: "antifriz", date: date, km: date === today() ? v.km : null, cost: null, note: "" })
      ]).then(function () { toast("Antifriz değişimi kaydedildi."); renderDetail(id); }).catch(fail);
    }
    $("coolantDate").addEventListener("change", function () { if (this.value) setCoolant(this.value); });
    $("coolantToday").addEventListener("click", function () { setCoolant(today()); });

    document.querySelectorAll(".date-row input").forEach(function (input) {
      input.addEventListener("change", function () {
        var patch = { dates: {} };
        patch.dates[input.dataset.key] = input.value || null;
        save(patch, "Tarih kaydedildi.");
      });
    });

    $("recordForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var rec = {
        type: $("recType").value,
        date: $("recDate").value,
        km: $("recKm").value ? parseInt($("recKm").value, 10) : null,
        cost: $("recCost").value ? parseFloat($("recCost").value) : null,
        note: $("recNote").value.trim()
      };
      if (!rec.date) { toast("Tarihi gir."); return; }
      var jobs = [Store.addRecord(id, rec)];
      // Yağ / antifriz kaydı daha yeniyse takip bilgisini de güncelle.
      if (rec.type === "yag" && rec.km != null && (!v.oil || rec.date >= v.oil.date)) {
        jobs.push(Store.updateVehicle(id, { oil: { km: rec.km, date: rec.date }, km: Math.max(rec.km, v.km) }));
      }
      if (rec.type === "antifriz" && (!v.coolantDate || rec.date >= v.coolantDate)) {
        jobs.push(Store.updateVehicle(id, { coolantDate: rec.date }));
      }
      Promise.all(jobs).then(function () { toast("Kayıt eklendi."); renderDetail(id); }).catch(fail);
    });

    document.querySelectorAll(".icon-del").forEach(function (b) {
      b.addEventListener("click", function () {
        if (!confirm("Bu kayıt silinsin mi?")) return;
        Store.deleteRecord(id, b.dataset.rid).then(function () { toast("Kayıt silindi."); renderDetail(id); }).catch(fail);
      });
    });

    $("deleteVehicle").addEventListener("click", function () {
      if (!confirm(v.brand + " " + v.model + " ve tüm kayıtları silinsin mi?")) return;
      Store.deleteVehicle(id).then(function () {
        toast("Araç silindi.");
        location.hash = "";
      }).catch(fail);
    });
  }

  // ---------- Başlat ----------
  wireAuth();
  window.addEventListener("hashchange", function () {
    if (!user) return;
    route();
    window.scrollTo(0, 0);
  });

  Store.init().then(function () {
    Store.onUser(function (u) {
      user = u;
      if (!u) { showView("auth"); return; }
      renderAccountLine();
      savePending().then(route, function (e) { fail(e); route(); });
    });
  }).catch(function (e) {
    showView("list");
    $("garageList").innerHTML = '<p class="form-error">' + esc(e.message) + "</p>";
  });
})();

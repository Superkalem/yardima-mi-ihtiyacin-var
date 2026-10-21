// Araba fotoğrafı (Wikipedia). Modelin Wikipedia sayfasında her kasa
// "Third generation (X85; 2005)" gibi yıllı bir bölümdür. Seçilen yıla uyan bölümün
// ilk fotoğrafı alınır; kasa bölümü yoksa sayfanın ana fotoğrafı kullanılır.
var CarPhoto = (function () {
  var WIKI_PARSE = "https://en.wikipedia.org/w/api.php?format=json&origin=*&redirects=1&action=parse";
  var CAR_ICON = '<svg viewBox="0 0 64 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 24v-5c0-2 1.5-3.5 3.5-4l9-2 7-6.5c1.2-1 2.6-1.5 4-1.5h12c2 0 3.8.9 5 2.5l4.5 5.5 6 1.2c2 .4 3 2 3 4V24h-4M14 24h28"/><circle cx="10" cy="24" r="4"/><circle cx="48" cy="24" r="4"/></svg>';
  var cache = {};

  function cached(key, make) {
    if (!cache[key]) {
      cache[key] = make();
      cache[key].catch(function () { delete cache[key]; });
    }
    return cache[key];
  }

  function getJson(url) {
    return fetch(url)
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (d) { if (d.error || !d.parse) throw new Error("sayfa yok"); return d.parse; });
  }

  function leadImage(page) {
    return cached("lead:" + page, function () {
      return fetch("https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(page.replace(/ /g, "_")))
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (d) {
          var o = d.originalimage;
          if (o && o.width <= 1600) return o.source;
          if (d.thumbnail) return d.thumbnail.source.replace(/\/\d+px-/, "/960px-");
          throw new Error("görsel yok");
        });
    });
  }

  function pickGeneration(sections, year) {
    var gens = [];
    sections.forEach(function (s) {
      var m = s.toclevel === 1 && s.line.replace(/<[^>]+>/g, "").match(/\b(19[5-9]\d|20[0-4]\d)\b/);
      if (m) gens.push({ index: s.index, year: +m[1] });
    });
    if (!gens.length) return null;
    var pick = null;
    gens.forEach(function (g) { if (g.year <= year && (!pick || g.year >= pick.year)) pick = g; });
    return pick || gens[0];
  }

  // Bölümdeki ilk büyük fotoğrafın en yüksek çözünürlüklü küçük kopyası.
  function firstPhoto(html) {
    var doc = new DOMParser().parseFromString(html, "text/html");
    var img = Array.prototype.find.call(doc.querySelectorAll("img"), function (i) {
      return +i.getAttribute("width") >= 120 && !/\.svg/i.test(i.getAttribute("src"));
    });
    if (!img) return null;
    var srcset = (img.getAttribute("srcset") || "").split(",").map(function (s) { return s.trim().split(" ")[0]; });
    var src = srcset[srcset.length - 1] || img.getAttribute("src");
    return (src.indexOf("//") === 0 ? "https:" : "") + src;
  }

  function generationImage(page, year) {
    return cached("sections:" + page, function () {
      return getJson(WIKI_PARSE + "&prop=sections&page=" + encodeURIComponent(page));
    }).then(function (p) {
      var gen = pickGeneration(p.sections, year);
      if (!gen) throw new Error("kasa bölümü yok");
      return cached("section:" + p.title + ":" + gen.index, function () {
        return getJson(WIKI_PARSE + "&prop=text&section=" + gen.index + "&page=" + encodeURIComponent(p.title));
      });
    }).then(function (s) {
      var src = firstPhoto(s.text["*"]);
      if (!src) throw new Error("görsel yok");
      return src;
    });
  }

  function load(brand, model, year) {
    var page = carWikiTitle(brand, model);
    return generationImage(page, year).catch(function () { return leadImage(page); });
  }

  // el: .car-photo kutusu. Yüklenirken parıltı, bulunamazsa araba simgesi gösterir.
  function photo(el, brand, model, year) {
    var token = brand + " " + model + " " + year;
    el.dataset.token = token;
    el.classList.remove("ready", "no-image");
    el.innerHTML = '<div class="skeleton"></div><div class="fallback">' + CAR_ICON + '</div><img alt="' + token + '">';
    var img = el.querySelector("img");
    var fail = function () {
      if (el.dataset.token === token) el.classList.add("ready", "no-image");
    };
    load(brand, model, year).then(function (src) {
      if (el.dataset.token !== token) return;
      img.onload = function () { img.classList.add("loaded"); el.classList.add("ready"); };
      img.onerror = fail;
      img.src = src;
    }).catch(fail);
  }

  // card: fotoğraf + altında "Marka Model · Yıl" yazısı olan kart.
  function show(card, brand, model, year) {
    card.className = "car-card visible";
    card.innerHTML =
      '<div class="car-photo"></div>' +
      '<div class="car-caption">' + brand + " " + model + " · " + year + "<small>Fotoğraf: Wikipedia</small></div>";
    photo(card.querySelector(".car-photo"), brand, model, year);
  }

  return { load: load, photo: photo, show: show };
})();

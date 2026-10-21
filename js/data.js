// Shell motor yağı eşleşmeleri, antifriz kuralları ve araba fotoğrafı için Wikipedia adları.
// Marka / model listesi js/cars.js'dedir. Değerler genel üretici tavsiyelerine dayanır;
// kesin bilgi için araç kullanım kılavuzuna ve Shell LubeMatch'e bakılmalıdır.

// Araba fotoğrafları Wikipedia'dan çekilir. Başlığı "Marka Model" ile aynı olmayanlar
// (eski "Mercedes ..." anahtarları Garajım'da kayıtlı araçlar için duruyor):
var CAR_WIKI = {
  "Mazda 2": "Mazda2",
  "Mazda 3": "Mazda3",
  "Mazda 5": "Mazda5",
  "Mazda 6": "Mazda6",
  "Mazda 323": "Mazda Familia",
  "Mini Cooper": "Mini Hatch",
  "Mini Cabrio": "Mini Hatch",
  "Toyota GT86": "Toyota 86",
  "Renault 12 Toros": "Renault 12",
  "Omoda 5": "Chery Omoda 5",
  "Hyundai Accent Era": "Hyundai Accent",
  "Volkswagen Polo Sedan": "Volkswagen Polo Mk5",
  "Fiat Egea": "Fiat Tipo (2015)",
  "Fiat Egea Cross": "Fiat Tipo (2015)",
  "Fiat Tipo": "Fiat Tipo (2015)",
  "Fiat Doblo": "Fiat Doblò",
  "Fiat 500": "Fiat 500 (2007)",
  "Fiat Punto": "Fiat Grande Punto",
  "Renault Megane": "Renault Mégane",
  "Toyota Proace City": "Toyota ProAce City",
  "Ford Puma": "Ford Puma (crossover)",
  "Ford Courier": "Ford Transit Courier",
  "Ford Connect": "Ford Transit Connect",
  "Ford Custom": "Ford Transit Custom",
  "Hyundai Accent Blue": "Hyundai Accent",
  "Honda Jazz": "Honda Fit",
  "Dacia Sandero Stepway": "Dacia Sandero",
  "BMW 1 Serisi": "BMW 1 Series",
  "BMW 2 Serisi": "BMW 2 Series",
  "BMW 3 Serisi": "BMW 3 Series",
  "BMW 4 Serisi": "BMW 4 Series",
  "BMW 5 Serisi": "BMW 5 Series",
  "Mercedes A Serisi": "Mercedes-Benz A-Class",
  "Mercedes C Serisi": "Mercedes-Benz C-Class",
  "Mercedes E Serisi": "Mercedes-Benz E-Class",
  "Mercedes CLA": "Mercedes-Benz CLA",
  "Mercedes GLA": "Mercedes-Benz GLA",
  "Mercedes GLC": "Mercedes-Benz GLC",
  "Mercedes Vito": "Mercedes-Benz Vito",
  "Mercedes Sprinter": "Mercedes-Benz Sprinter"
};

var BRAND_WIKI = { "KGM / SsangYong": "SsangYong" };

function carWikiTitle(brand, model) {
  var key = brand + " " + model;
  if (CAR_WIKI[key]) return CAR_WIKI[key];
  var b = BRAND_WIKI[brand] || brand;
  if (b === "BMW") return key.replace(/ Serisi\b/, " Series");
  if (b === "Mercedes-Benz") return b + " " + model.replace(/^([A-Z]) Serisi$/, "$1-Class");
  // "DS 4", "MG ZS" gibi marka adıyla başlayan modeller
  return model.indexOf(b) === 0 ? model : b + " " + model;
}

// ---------- Shell ürünleri ----------
// img: img/shell/ içindeki resmi ürün fotoğrafı (kaynak: shell.co.uk Helix Ultra ürün listesi).
// Resmi fotoğrafı bulunmayan ürünlerde img null'dır; sonuçta Shell logosu gösterilir.
var SHELL = {
  "avl-0w20": { name: "Helix Ultra Professional AV-L", visc: "0W-20", approvals: "VW 508.00 / 509.00", img: "avl-0w20.jpg" },
  "avl-0w30": { name: "Helix Ultra Professional AV-L", visc: "0W-30", approvals: "VW 504.00 / 507.00", img: "avl-0w30.jpg" },
  "ect-c3-5w30": { name: "Helix Ultra ECT C3", visc: "5W-30", approvals: "ACEA C3 · VW 504.00/507.00 · BMW LL-04 · MB 229.51", img: "ect-c3-5w30.jpg" },
  "ect-c23-0w30": { name: "Helix Ultra ECT C2/C3", visc: "0W-30", approvals: "ACEA C2 / C3", img: "ect-c23-0w30.jpg" },
  "ect-c6-0w20": { name: "Helix Ultra ECT C6", visc: "0W-20", approvals: "ACEA C6 · BMW LL-17 FE+ · MB 229.71", img: "ect-c6-0w20.jpg" },
  "sp-0w20": { name: "Helix Ultra SP", visc: "0W-20", approvals: "API SP · ILSAC GF-6A", img: "sp-0w20.jpg" },
  "hybrid-0w20": { name: "Helix HYBRID", visc: "0W-20", approvals: "Hibrit motorlar için", img: "hybrid-0w20.jpg" },
  "ultra-5w40": { name: "Helix Ultra", visc: "5W-40", approvals: "ACEA A3/B4 · MB 229.5 · VW 502.00/505.00 · RN0700/0710", img: "ultra-5w40.jpg" },
  "af-5w20": { name: "Helix Ultra Professional AF", visc: "5W-20", approvals: "Ford WSS-M2C948-B", img: "af-5w20.jpg" },
  "af-5w30": { name: "Helix Ultra Professional AF", visc: "5W-30", approvals: "Ford WSS-M2C913-D", img: "af-5w30.jpg" },
  "arl-5w30": { name: "Helix Ultra Professional AR-L", visc: "5W-30", approvals: "Renault RN0720 · ACEA C4", img: "arl-5w30.jpg" },
  "arl-rn17-5w30": { name: "Helix Ultra Professional AR-L RN17", visc: "5W-30", approvals: "Renault RN17 · ACEA C3", img: null },
  "apl-5w30": { name: "Helix Ultra Professional AP-L", visc: "5W-30", approvals: "PSA B71 2290 · ACEA C2", img: "apl-5w30.jpg" },
  "apl-0w30": { name: "Helix Ultra Professional AP-L", visc: "0W-30", approvals: "PSA B71 2312 · ACEA C2", img: "apl-0w30.jpg" },
  "apl-0w20": { name: "Helix Ultra Professional AP-L", visc: "0W-20", approvals: "PSA B71 2010", img: "apl-0w20.jpg" },
  "ag-5w30": { name: "Helix Ultra Professional AG", visc: "5W-30", approvals: "GM dexos2", img: "ag-5w30.jpg" },
  "aml-5w30": { name: "Helix Ultra Professional AM-L", visc: "5W-30", approvals: "MB 229.51 / 229.52", img: "aml-5w30.jpg" }
};

function shellImage(p) {
  return p.img ? "img/shell/" + p.img : null;
}

// Her kural (yıl, yakıt) alır; { shell, alt, spec, longlife } döner. alt yoksa alternatif gösterilmez.
var OIL_RULES = {
  "Volkswagen": function (y, f) {
    if (y < 2005) return { shell: "ultra-5w40", spec: "VW 502.00 / 505.00" };
    if (y >= 2019) return f === "dizel"
      ? { shell: "avl-0w30", alt: "ect-c3-5w30", spec: "VW 507.00", longlife: true }
      : { shell: "avl-0w20", spec: "VW 508.00 / 509.00", longlife: true };
    return { shell: "ect-c3-5w30", alt: "avl-0w30", spec: "VW 504.00 / 507.00", longlife: true };
  },
  "Toyota": function (y, f) {
    if (f === "dizel") return { shell: "ect-c3-5w30", alt: "ect-c23-0w30", spec: "ACEA C2 / C3" };
    return y >= 2010
      ? { shell: "sp-0w20", alt: "ect-c3-5w30", spec: "API SP / ILSAC GF-6A" }
      : { shell: "ect-c3-5w30", spec: "API SN" };
  },
  "Honda": function (y, f) {
    if (f === "dizel") return { shell: "ect-c23-0w30", spec: "ACEA C2" };
    return y >= 2010
      ? { shell: "sp-0w20", alt: "ect-c3-5w30", spec: "API SP / ILSAC GF-6A" }
      : { shell: "ect-c3-5w30", spec: "API SN" };
  },
  "Ford": function (y, f) {
    if (f === "dizel") return { shell: "af-5w30", spec: "Ford WSS-M2C913-D" };
    return y >= 2012
      ? { shell: "af-5w20", alt: "af-5w30", spec: "Ford WSS-M2C948-B" }
      : { shell: "af-5w30", spec: "Ford WSS-M2C913-D" };
  },
  "Renault": function (y, f) {
    if (y >= 2019) return { shell: "arl-rn17-5w30", spec: "Renault RN17" };
    if (f === "dizel" && y >= 2010) return { shell: "arl-5w30", spec: "Renault RN0720" };
    return { shell: "ultra-5w40", spec: "Renault RN0700 / RN0710" };
  },
  "Fiat": function (y, f) {
    if (f === "dizel") return y >= 2015
      ? { shell: "ect-c23-0w30", spec: "Fiat 9.55535-DS1" }
      : { shell: "apl-5w30", spec: "Fiat 9.55535-S1" };
    return { shell: "ultra-5w40", spec: "Fiat 9.55535-H2 / M2" };
  },
  "Peugeot": function (y, f) {
    if (f === "dizel") return y >= 2010
      ? { shell: "apl-5w30", alt: "apl-0w30", spec: "PSA B71 2290" }
      : { shell: "ultra-5w40", spec: "PSA B71 2296" };
    if (y >= 2020) return { shell: "apl-0w20", spec: "PSA B71 2010" };
    if (y >= 2012) return { shell: "apl-0w30", alt: "ect-c23-0w30", spec: "PSA B71 2312" };
    return { shell: "ultra-5w40", spec: "PSA B71 2296" };
  },
  "Opel": function (y, f) {
    if (f !== "dizel" && y >= 2020) return { shell: "apl-0w20", spec: "PSA B71 2010" };
    if (y >= 2010) return { shell: "ag-5w30", spec: "GM dexos2", longlife: true };
    return { shell: "ag-5w30", spec: f === "dizel" ? "GM-LL-B-025" : "GM-LL-A-025" };
  },
  "Hyundai": function (y, f) {
    if (f === "dizel") return { shell: "ect-c3-5w30", spec: "ACEA C3" };
    return y >= 2019
      ? { shell: "sp-0w20", alt: "ect-c3-5w30", spec: "API SP" }
      : { shell: "ect-c3-5w30", spec: "API SN / ACEA A5" };
  },
  "BMW": function (y, f) {
    if (y < 2005) return { shell: "ultra-5w40", spec: "BMW Longlife-01" };
    if (f !== "dizel" && y >= 2017) return { shell: "ect-c6-0w20", spec: "BMW Longlife-17 FE+", longlife: true };
    return { shell: "ect-c3-5w30", spec: "BMW Longlife-04", longlife: true };
  },
  "Mercedes": function (y, f) {
    if (f === "dizel") return { shell: "aml-5w30", alt: "ect-c3-5w30", spec: y >= 2014 ? "MB 229.52" : "MB 229.51", longlife: true };
    if (y >= 2015) return { shell: "ect-c6-0w20", spec: "MB 229.71", longlife: true };
    return { shell: "ultra-5w40", spec: "MB 229.5", longlife: true };
  }
};
OIL_RULES["Dacia"] = OIL_RULES["Renault"];

// ---------- Antifriz ----------
// color: soğutma suyunun tipik rengi (null = üreticiye göre değişir). Renk değil norm esas alınmalı.
var COOLANT_RULES = {
  "Volkswagen": function (y) {
    if (y >= 2019) return { name: "G12evo", spec: "VW TL 774 L", type: "Si-OAT", color: "#c25bd6", colorName: "Mor-pembe" };
    if (y >= 2008) return { name: "G13", spec: "VW TL 774 J", type: "Si-OAT", color: "#a24ccf", colorName: "Mor" };
    if (y >= 2005) return { name: "G12++", spec: "VW TL 774 G", type: "Si-OAT", color: "#b2509e", colorName: "Mor" };
    return { name: "G12+", spec: "VW TL 774 F", type: "OAT", color: "#e0457b", colorName: "Kırmızı-pembe" };
  },
  "Toyota": function (y) {
    return y >= 2005
      ? { name: "Super Long Life Coolant", spec: "Toyota SLLC", type: "P-HOAT", color: "#ff6fa5", colorName: "Pembe" }
      : { name: "Long Life Coolant", spec: "Toyota LLC", type: "P-HOAT", color: "#e2394a", colorName: "Kırmızı" };
  },
  "Honda": function () {
    return { name: "Type 2 Coolant", spec: "Honda Type 2", type: "P-HOAT", color: "#3a8bff", colorName: "Mavi" };
  },
  "Hyundai": function () {
    return { name: "Long Life Coolant", spec: "Hyundai/Kia LLC", type: "P-HOAT", color: "#3bbf6a", colorName: "Yeşil" };
  },
  "Ford": function () {
    return { name: "Motorcraft Orange", spec: "Ford WSS-M97B44-D", type: "OAT", color: "#ff8a3d", colorName: "Turuncu-pembe" };
  },
  "Renault": function () {
    return { name: "Glacéol RX Type D", spec: "Renault 41-01-001 Type D", type: "OAT", color: "#c9d43a", colorName: "Sarı-yeşil" };
  },
  "Fiat": function () {
    return { name: "Paraflu Up", spec: "Fiat 9.55523", type: "OAT", color: "#d9363e", colorName: "Kırmızı" };
  },
  "Peugeot": function () {
    return { name: "Type D", spec: "PSA B71 5110", type: "OAT", color: null, colorName: "Üreticiye göre değişir" };
  },
  "Opel": function (y) {
    return y >= 2020
      ? { name: "Type D", spec: "PSA B71 5110", type: "OAT", color: null, colorName: "Üreticiye göre değişir" }
      : { name: "Dex-Cool", spec: "GM 6277M", type: "OAT", color: "#ff6a2b", colorName: "Turuncu-kırmızı" };
  },
  "BMW": function () {
    return { name: "BMW Antifriz (G48 tipi)", spec: "BMW N 600 69.0", type: "Silikatlı HOAT", color: "#2bb7b0", colorName: "Mavi-yeşil" };
  },
  "Mercedes": function (y) {
    return y >= 2014
      ? { name: "MB Si-OAT (G40 tipi)", spec: "MB 325.5 / 325.6", type: "Si-OAT", color: "#e46fb4", colorName: "Pembe-mor" }
      : { name: "MB Antifriz (G48 tipi)", spec: "MB 325.0", type: "Silikatlı HOAT", color: "#2bb7b0", colorName: "Mavi-yeşil" };
  }
};
COOLANT_RULES["Dacia"] = COOLANT_RULES["Renault"];

// ---------- Marka grupları ----------
// Aynı motorları / normları kullanan markalar, kuralı yazılmış markaya bağlanır.
// Listede olmayan markalarda genel öneri gösterilir (oil.generic / coolant.generic).
var BRAND_GROUP = {
  "Mercedes-Benz": "Mercedes", "Smart": "Mercedes",
  "Audi": "Volkswagen", "Seat": "Volkswagen", "Cupra": "Volkswagen", "Skoda": "Volkswagen", "Bentley": "Volkswagen",
  "Citroën": "Peugeot", "DS": "Peugeot",
  "Alfa Romeo": "Fiat", "Lancia": "Fiat", "Abarth": "Fiat", "Tofaş": "Fiat",
  "Alpine": "Renault",
  "Lexus": "Toyota", "Daihatsu": "Toyota",
  "Acura": "Honda",
  "Kia": "Hyundai", "Genesis": "Hyundai",
  "Mini": "BMW", "Rolls-Royce": "BMW",
  "Chevrolet": "Opel", "Saab": "Opel",
  "Lincoln": "Ford",
  "Porsche": "performans", "Ferrari": "performans", "Lamborghini": "performans",
  "Maserati": "performans", "Aston Martin": "performans"
};

function ruleFor(table, brand) {
  return table[brand] || table[BRAND_GROUP[brand]] || null;
}

// Üreticiye özel kuralı olmayan markalar için yıl ve yakıta göre genel öneri.
var GENERIC_OIL = {
  "performans": function (y, f) {
    return f === "dizel"
      ? { shell: "ect-c3-5w30", spec: "ACEA C3" }
      : { shell: "ultra-5w40", spec: "ACEA A3/B4 (yüksek performans)" };
  },
  "genel": function (y, f) {
    if (f === "dizel") return y >= 2010
      ? { shell: "ect-c3-5w30", alt: "ect-c23-0w30", spec: "ACEA C3 (partikül filtreli dizel)" }
      : { shell: "ultra-5w40", spec: "ACEA A3/B4" };
    if (y >= 2015) return { shell: "sp-0w20", alt: "ect-c3-5w30", spec: "API SP / ILSAC GF-6A" };
    if (y >= 2005) return { shell: "ect-c3-5w30", spec: "API SN / ACEA C3" };
    return { shell: "ultra-5w40", spec: "ACEA A3/B4" };
  }
};

function getCoolant(brand, year) {
  var rule = ruleFor(COOLANT_RULES, brand);
  var c = rule
    ? rule(year)
    : { name: "Uzun ömürlü antifriz", spec: "Kullanım kılavuzundaki norm", type: "OAT / HOAT", color: null, colorName: "Üreticiye göre değişir", generic: true };
  c.mix = "%50 antifriz + %50 saf su";
  c.protection = "Yaklaşık −37 °C";
  c.interval = "4–5 yıl / 100–150 bin km";
  return c;
}

// Hibritlerde genelde benzinli motor kuralı geçerlidir.
function getOil(brand, model, year, fuel, km) {
  var baseFuel = fuel === "hibrit" ? "benzin" : fuel;
  var rule = ruleFor(OIL_RULES, brand);
  var generic = !rule;
  var r = rule ? rule(year, baseFuel) : (GENERIC_OIL[BRAND_GROUP[brand]] || GENERIC_OIL.genel)(year, baseFuel);
  if (year < 2000) r = { shell: "ultra-5w40", spec: "API SL / ACEA A3/B4" };
  if (fuel === "hibrit" && r.shell === "sp-0w20") r = { shell: "hybrid-0w20", alt: "sp-0w20", spec: r.spec };

  var product = SHELL[r.shell];
  var oil = {
    product: product,
    alt: r.alt ? SHELL[r.alt] : null,
    spec: r.spec,
    longlife: !!r.longlife,
    generic: generic
  };
  oil.type = /^(0W|5W)/.test(product.visc) ? "Tam sentetik" : "Yarı sentetik";

  // Değişim aralığı
  var interval = oil.longlife ? 15000 : 10000;
  if (km >= 150000) interval = Math.min(interval, 10000);
  if (km >= 250000) interval = 7500;
  oil.interval = interval;
  oil.next = Math.ceil((km + 1) / interval) * interval;

  // Kilometreye göre not
  if (km >= 250000) {
    oil.note = "Yüksek kilometre: Yağ seviyesini her 1.000 km'de kontrol et ve değişim aralığını kısa tut.";
  } else if (km >= 150000) {
    oil.note = "Aracın olgunluk döneminde: Yağ seviyesini düzenli kontrol et, filtreyi her değişimde yenile.";
  } else if (km < 20000) {
    oil.note = "Aracın yeni sayılır: Garanti kapsamını korumak için yalnızca " + oil.spec + " onaylı yağ kullan.";
  } else {
    oil.note = "Yağ değişiminde yağ filtresini de yenile. Ağırlıklı şehir içi kullanımda aralığı kısaltmak motor ömrünü uzatır.";
  }
  if (generic) {
    oil.note = "Bu marka için üreticiye özel norm listemizde yok; gösterilen yıl ve yakıta göre genel öneridir. Kullanım kılavuzundaki normu Shell LubeMatch ile mutlaka doğrula. " + oil.note;
  }
  return oil;
}

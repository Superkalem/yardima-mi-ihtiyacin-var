// Garaj verisi. FIREBASE_CONFIG doluysa Firebase (giriş + Firestore), boşsa bu
// tarayıcının localStorage'ı (demo) kullanılır. İki modun da arayüzü aynıdır ve
// hepsi Promise döner.
//
// Firestore yapısı:
//   users/{uid}/vehicles/{aracId}                 -> araç bilgileri ve takip tarihleri
//   users/{uid}/vehicles/{aracId}/records/{id}    -> bakım geçmişi kayıtları
var Store = (function () {
  var SDK = "https://www.gstatic.com/firebasejs/10.12.2/";
  var LOCAL_KEY = "garaj-v1";
  var auth = null;
  var db = null;

  function now() { return new Date().toISOString(); }
  function withId(id, data) { var o = { id: id }; for (var k in data) o[k] = data[k]; return o; }
  function byCreated(a, b) { return (a.createdAt || "").localeCompare(b.createdAt || ""); }
  function byDateDesc(a, b) { return (b.date || "").localeCompare(a.date || "") || (b.createdAt || "").localeCompare(a.createdAt || ""); }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = function () { reject(new Error("Firebase yüklenemedi. İnternet bağlantını kontrol et.")); };
      document.head.appendChild(s);
    });
  }

  // ---------- Yerel (demo) ----------
  function readLocal() {
    try { return JSON.parse(localStorage.getItem(LOCAL_KEY)) || { vehicles: {} }; }
    catch (e) { return { vehicles: {} }; }
  }
  function writeLocal(data) {
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(data)); }
    catch (e) { throw new Error("Tarayıcı veriyi kaydedemedi (gizli sekme olabilir)."); }
  }
  function localId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

  var local = {
    onUser: function (cb) { cb({ demo: true }); },
    listVehicles: function () {
      var v = readLocal().vehicles;
      return Promise.resolve(Object.keys(v).map(function (id) {
        var o = withId(id, v[id]);
        delete o.records;
        return o;
      }).sort(byCreated));
    },
    getVehicle: function (id) {
      var v = readLocal().vehicles[id];
      if (!v) return Promise.reject(new Error("Araç bulunamadı."));
      var o = withId(id, v);
      delete o.records;
      return Promise.resolve(o);
    },
    addVehicle: function (data) {
      var all = readLocal();
      var id = localId();
      data.createdAt = now();
      data.records = {};
      all.vehicles[id] = data;
      writeLocal(all);
      return Promise.resolve(id);
    },
    updateVehicle: function (id, patch) {
      var all = readLocal();
      var v = all.vehicles[id];
      for (var k in patch) {
        v[k] = patch[k] && typeof patch[k] === "object" && !Array.isArray(patch[k]) && v[k]
          ? Object.assign({}, v[k], patch[k]) : patch[k];
      }
      v.updatedAt = now();
      writeLocal(all);
      return Promise.resolve();
    },
    deleteVehicle: function (id) {
      var all = readLocal();
      delete all.vehicles[id];
      writeLocal(all);
      return Promise.resolve();
    },
    listRecords: function (vid) {
      var r = readLocal().vehicles[vid].records || {};
      return Promise.resolve(Object.keys(r).map(function (id) { return withId(id, r[id]); }).sort(byDateDesc));
    },
    addRecord: function (vid, rec) {
      var all = readLocal();
      var id = localId();
      rec.createdAt = now();
      all.vehicles[vid].records = all.vehicles[vid].records || {};
      all.vehicles[vid].records[id] = rec;
      writeLocal(all);
      return Promise.resolve(id);
    },
    deleteRecord: function (vid, rid) {
      var all = readLocal();
      delete all.vehicles[vid].records[rid];
      writeLocal(all);
      return Promise.resolve();
    }
  };

  // ---------- Firebase ----------
  function vehicles() {
    return db.collection("users").doc(auth.currentUser.uid).collection("vehicles");
  }
  function records(vid) { return vehicles().doc(vid).collection("records"); }
  function docs(snap) { return snap.docs.map(function (d) { return withId(d.id, d.data()); }); }

  var remote = {
    onUser: function (cb) {
      auth.onAuthStateChanged(function (u) {
        cb(u ? { uid: u.uid, email: u.email, name: u.displayName } : null);
      });
    },
    signInGoogle: function () {
      var provider = new firebase.auth.GoogleAuthProvider();
      return auth.signInWithPopup(provider).catch(function (e) {
        // Telefonlarda açılır pencere engellenirse yönlendirmeyle dene.
        if (e.code === "auth/popup-blocked" || e.code === "auth/operation-not-supported-in-this-environment") {
          return auth.signInWithRedirect(provider);
        }
        throw e;
      });
    },
    signIn: function (email, password) { return auth.signInWithEmailAndPassword(email, password); },
    signUp: function (email, password) { return auth.createUserWithEmailAndPassword(email, password); },
    resetPassword: function (email) { return auth.sendPasswordResetEmail(email); },
    signOut: function () { return auth.signOut(); },
    listVehicles: function () {
      return vehicles().get().then(function (s) { return docs(s).sort(byCreated); });
    },
    getVehicle: function (id) {
      return vehicles().doc(id).get().then(function (d) {
        if (!d.exists) throw new Error("Araç bulunamadı.");
        return withId(d.id, d.data());
      });
    },
    addVehicle: function (data) {
      data.createdAt = now();
      return vehicles().add(data).then(function (ref) { return ref.id; });
    },
    updateVehicle: function (id, patch) {
      patch.updatedAt = now();
      return vehicles().doc(id).set(patch, { merge: true });
    },
    deleteVehicle: function (id) {
      // Firestore alt koleksiyonları kendiliğinden silmez; önce kayıtları sil.
      return records(id).get().then(function (s) {
        var batch = db.batch();
        s.docs.forEach(function (d) { batch.delete(d.ref); });
        batch.delete(vehicles().doc(id));
        return batch.commit();
      });
    },
    listRecords: function (vid) {
      return records(vid).get().then(function (s) { return docs(s).sort(byDateDesc); });
    },
    addRecord: function (vid, rec) {
      rec.createdAt = now();
      return records(vid).add(rec).then(function (ref) { return ref.id; });
    },
    deleteRecord: function (vid, rid) { return records(vid).doc(rid).delete(); }
  };

  var api = { mode: "local" };

  // Sayfa açılınca bir kez çağrılır; Firebase ayarlıysa SDK'yı yükler.
  api.init = function () {
    var target = local;
    var ready = Promise.resolve();
    if (window.FIREBASE_CONFIG) {
      ready = loadScript(SDK + "firebase-app-compat.js").then(function () {
        return Promise.all([loadScript(SDK + "firebase-auth-compat.js"), loadScript(SDK + "firebase-firestore-compat.js")]);
      }).then(function () {
        firebase.initializeApp(window.FIREBASE_CONFIG);
        auth = firebase.auth();
        db = firebase.firestore();
        target = remote;
        api.mode = "firebase";
      });
    }
    return ready.then(function () {
      for (var k in target) api[k] = target[k];
    });
  };

  // Firebase hata kodlarını kullanıcıya gösterilecek Türkçe metne çevirir.
  api.errorText = function (e) {
    var map = {
      "auth/invalid-email": "E-posta adresi geçersiz.",
      "auth/user-not-found": "E-posta veya şifre hatalı.",
      "auth/wrong-password": "E-posta veya şifre hatalı.",
      "auth/invalid-credential": "E-posta veya şifre hatalı.",
      "auth/invalid-login-credentials": "E-posta veya şifre hatalı.",
      "auth/email-already-in-use": "Bu e-posta ile zaten bir hesap var. Giriş yapmayı dene.",
      "auth/weak-password": "Şifre en az 6 karakter olmalı.",
      "auth/missing-password": "Şifreni yaz.",
      "auth/network-request-failed": "İnternet bağlantını kontrol et.",
      "auth/too-many-requests": "Çok fazla deneme yapıldı. Biraz sonra tekrar dene.",
      "auth/unauthorized-domain": "Bu adres Firebase'de yetkili değil (Authentication > Settings > Authorized domains).",
      "auth/operation-not-allowed": "Bu giriş yöntemi Firebase konsolunda açık değil.",
      "permission-denied": "Bu veriye erişim izni yok. Firestore kurallarını kontrol et."
    };
    if (e && (e.code === "auth/popup-closed-by-user" || e.code === "auth/cancelled-popup-request")) return "";
    return (e && map[e.code]) || (e && e.message) || "Bir hata oluştu.";
  };

  return api;
})();
